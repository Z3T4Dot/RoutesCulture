import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import * as QRCode from "qrcode"
import { v4 as uuidv4 } from "uuid"
import { CodigoQR, EstadoQR } from "./entities/code-qr.entity"
import type { NotificacionesService } from "../notifications/notifications.service"

@Injectable()
export class QrService {
    constructor(
        private notificacionesService: NotificacionesService,
        @InjectRepository(CodigoQR)
        private qrRepository: Repository<CodigoQR>,
    ) { }

    async generarCodigoQR(
        usuarioId: string,
        rutaId: string,
        departamento: string,
        municipio: string,
        telefono?: string,
    ): Promise<{ codigo: string; qrImage: string }> {
        // Generar código único
        const codigo = `QR-${uuidv4().substring(0, 8).toUpperCase()}`

        // Configurar expiración (30 días)
        const fechaExpiracion = new Date()
        fechaExpiracion.setDate(fechaExpiracion.getDate() + 30)

        // Crear registro en base de datos
        const codigoQR = this.qrRepository.create({
            codigo,
            usuarioId,
            rutaId,
            porcentajeDescuento: 15, // 15% de descuento por defecto
            montoMaximoDescuento: 50000, // Máximo $50,000 COP
            fechaExpiracion,
            departamento,
            municipio,
            descripcion: "Código QR para descuentos en negocios locales",
        })

        await this.qrRepository.save(codigoQR)

        // Generar imagen QR
        const qrData = JSON.stringify({
            codigo,
            usuarioId,
            rutaId,
            descuento: codigoQR.porcentajeDescuento,
            valido_hasta: fechaExpiracion.toISOString(),
        })

        const qrImage = await QRCode.toDataURL(qrData, {
            errorCorrectionLevel: "M",
            type: "image/png",
            margin: 1,
            color: {
                dark: "#000000",
                light: "#FFFFFF",
            },
            width: 256,
        })

        // Enviar por SMS si se proporciona teléfono
        if (telefono) {
            await this.notificacionesService.enviarCodigoQR(telefono, codigo)
        }

        return { codigo, qrImage }
    }

    async validarCodigoQR(
        codigo: string,
        negocioId?: string,
    ): Promise<{
        valido: boolean
        descuento?: number
        mensaje: string
    }> {
        const codigoQR = await this.qrRepository.findOne({ where: { codigo } })

        if (!codigoQR) {
            return { valido: false, mensaje: "Código QR no encontrado" }
        }

        if (codigoQR.estado !== EstadoQR.ACTIVO) {
            return { valido: false, mensaje: "Código QR no está activo" }
        }

        if (new Date() > codigoQR.fechaExpiracion) {
            await this.qrRepository.update(codigoQR.id, { estado: EstadoQR.EXPIRADO })
            return { valido: false, mensaje: "Código QR expirado" }
        }

        if (codigoQR.vecesUsado >= codigoQR.usoMaximo) {
            await this.qrRepository.update(codigoQR.id, { estado: EstadoQR.USADO })
            return { valido: false, mensaje: "Código QR ya fue utilizado" }
        }

        // Verificar si el negocio está en la lista de válidos (si se especifica)
        if (negocioId && codigoQR.negociosValidos && codigoQR.negociosValidos.length > 0) {
            if (!codigoQR.negociosValidos.includes(negocioId)) {
                return { valido: false, mensaje: "Código QR no válido para este negocio" }
            }
        }

        return {
            valido: true,
            descuento: codigoQR.porcentajeDescuento,
            mensaje: `Descuento del ${codigoQR.porcentajeDescuento}% aplicado`,
        }
    }

    async usarCodigoQR(
        codigo: string,
        monto: number,
        negocioId?: string,
    ): Promise<{
        exito: boolean
        descuentoAplicado: number
        montoFinal: number
        mensaje: string
    }> {
        const validacion = await this.validarCodigoQR(codigo, negocioId)

        if (!validacion.valido) {
            return {
                exito: false,
                descuentoAplicado: 0,
                montoFinal: monto,
                mensaje: validacion.mensaje,
            }
        }

        const codigoQR = await this.qrRepository.findOne({ where: { codigo } })

        // Calcular descuento
        let descuentoAplicado = (monto * codigoQR.porcentajeDescuento) / 100

        // Aplicar límite máximo si existe
        if (codigoQR.montoMaximoDescuento && descuentoAplicado > codigoQR.montoMaximoDescuento) {
            descuentoAplicado = codigoQR.montoMaximoDescuento
        }

        const montoFinal = monto - descuentoAplicado

        // Incrementar contador de uso
        await this.qrRepository.increment({ id: codigoQR.id }, "vecesUsado", 1)

        // Si alcanzó el máximo de usos, marcar como usado
        if (codigoQR.vecesUsado + 1 >= codigoQR.usoMaximo) {
            await this.qrRepository.update(codigoQR.id, { estado: EstadoQR.USADO })
        }

        return {
            exito: true,
            descuentoAplicado,
            montoFinal,
            mensaje: `Descuento de $${descuentoAplicado.toLocaleString("es-CO")} aplicado exitosamente`,
        }
    }

    async getCodigosByUser(usuarioId: string): Promise<CodigoQR[]> {
        return this.qrRepository.find({
            where: { usuarioId },
            order: { createdAt: "DESC" },
        })
    }

    async getEstadisticasQR() {
        const total = await this.qrRepository.count()
        const activos = await this.qrRepository.count({ where: { estado: EstadoQR.ACTIVO } })
        const usados = await this.qrRepository.count({ where: { estado: EstadoQR.USADO } })
        const expirados = await this.qrRepository.count({ where: { estado: EstadoQR.EXPIRADO } })

        const usosTotales = await this.qrRepository
            .createQueryBuilder("qr")
            .select("SUM(qr.vecesUsado)", "total")
            .getRawOne()

        return {
            total,
            activos,
            usados,
            expirados,
            usosTotales: Number.parseInt(usosTotales.total) || 0,
        }
    }
}
