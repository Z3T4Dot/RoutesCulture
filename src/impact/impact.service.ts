import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { ImpactoTurista } from "./entities/impact-tourist.entity"
import { CertificadoImpacto } from "./entities/certified-impact.entity"

@Injectable()
export class ImpactoService {
    constructor(
        @InjectRepository(ImpactoTurista)
        private impactoRepository: Repository<ImpactoTurista>,
        @InjectRepository(CertificadoImpacto)
        private certificadoRepository: Repository<CertificadoImpacto>,
    ) { }

    async getImpactoByUser(userId: string) {
        const impactos = await this.impactoRepository.find({
            where: { turistaId: userId },
            relations: ["turista"],
            order: { fechaImpacto: "DESC" },
        })

        const resumen = await this.impactoRepository
            .createQueryBuilder("impacto")
            .select("SUM(impacto.monto)", "totalAportado")
            .addSelect("SUM(impacto.familiasImpactadas)", "totalFamilias")
            .addSelect("SUM(impacto.excombatientesImpactados)", "totalExcombatientes")
            .addSelect("COUNT(*)", "totalTransacciones")
            .where("impacto.turistaId = :userId", { userId })
            .getRawOne()

        const impactoPorTipo = await this.impactoRepository
            .createQueryBuilder("impacto")
            .select("impacto.tipo", "tipo")
            .addSelect("SUM(impacto.monto)", "monto")
            .addSelect("COUNT(*)", "cantidad")
            .where("impacto.turistaId = :userId", { userId })
            .groupBy("impacto.tipo")
            .getRawMany()

        const impactoPorDepartamento = await this.impactoRepository
            .createQueryBuilder("impacto")
            .select("impacto.departamento", "departamento")
            .addSelect("SUM(impacto.monto)", "monto")
            .addSelect("SUM(impacto.familiasImpactadas)", "familias")
            .where("impacto.turistaId = :userId", { userId })
            .groupBy("impacto.departamento")
            .getRawMany()

        return {
            impactos,
            resumen: {
                totalAportado: Number.parseFloat(resumen.totalAportado) || 0,
                totalFamilias: Number.parseInt(resumen.totalFamilias) || 0,
                totalExcombatientes: Number.parseInt(resumen.totalExcombatientes) || 0,
                totalTransacciones: Number.parseInt(resumen.totalTransacciones) || 0,
            },
            impactoPorTipo,
            impactoPorDepartamento,
        }
    }

    async registrarImpacto(impactoData: Partial<ImpactoTurista>): Promise<ImpactoTurista> {
        const impacto = this.impactoRepository.create(impactoData)
        const savedImpacto = await this.impactoRepository.save(impacto)

        // Generar certificado automáticamente para montos significativos
        if (savedImpacto.monto >= 50000) {
            // Más de $50,000 COP
            await this.generarCertificado(savedImpacto.id)
        }

        return savedImpacto
    }

    async generarCertificado(impactoId: string): Promise<CertificadoImpacto> {
        const impacto = await this.impactoRepository.findOne({
            where: { id: impactoId },
            relations: ["turista"],
        })

        if (!impacto) {
            throw new NotFoundException("Impacto no encontrado")
        }

        // Generar número consecutivo
        const count = await this.certificadoRepository.count()
        const numeroConsecutivo = `CERT-${new Date().getFullYear()}-${String(count + 1).padStart(6, "0")}`

        // Generar contenido del certificado
        const contenido = this.generarContenidoCertificado(impacto, numeroConsecutivo)

        const certificado = this.certificadoRepository.create({
            impactoId,
            numeroConsecutivo,
            contenido,
        })

        const savedCertificado = await this.certificadoRepository.save(certificado)

        // Marcar impacto como certificado generado
        await this.impactoRepository.update(impactoId, { certificadoGenerado: true })

        return savedCertificado
    }

    private generarContenidoCertificado(impacto: ImpactoTurista, numeroConsecutivo: string): string {
        return `
CERTIFICADO DE IMPACTO SOCIAL
Número: ${numeroConsecutivo}

Certificamos que ${impacto.turista.nombre} ${impacto.turista.apellido}
ha contribuido significativamente al desarrollo de comunidades en proceso de reconciliación.

DETALLES DEL IMPACTO:
- Tipo de contribución: ${impacto.tipo}
- Monto aportado: $${impacto.monto.toLocaleString("es-CO")} COP
- Beneficiario: ${impacto.beneficiario}
- Ubicación: ${impacto.municipio}, ${impacto.departamento}
- Familias impactadas: ${impacto.familiasImpactadas}
- Excombatientes beneficiados: ${impacto.excombatientesImpactados}
- Fecha: ${impacto.fechaImpacto.toLocaleDateString("es-CO")}

Este certificado reconoce su compromiso con la construcción de paz y el desarrollo sostenible de territorios que han superado la violencia.

Generado el: ${new Date().toLocaleDateString("es-CO")}
    `.trim()
    }

    async getCertificadosByUser(userId: string): Promise<CertificadoImpacto[]> {
        return this.certificadoRepository
            .createQueryBuilder("certificado")
            .leftJoinAndSelect("certificado.impacto", "impacto")
            .leftJoinAndSelect("impacto.turista", "turista")
            .where("turista.id = :userId", { userId })
            .orderBy("certificado.fechaGeneracion", "DESC")
            .getMany()
    }

    async getEstadisticasGenerales() {
        const totalImpactos = await this.impactoRepository.count()

        const montoTotal = await this.impactoRepository
            .createQueryBuilder("impacto")
            .select("SUM(impacto.monto)", "total")
            .getRawOne()

        const familiasTotales = await this.impactoRepository
            .createQueryBuilder("impacto")
            .select("SUM(impacto.familiasImpactadas)", "total")
            .getRawOne()

        const excombatientesTotales = await this.impactoRepository
            .createQueryBuilder("impacto")
            .select("SUM(impacto.excombatientesImpactados)", "total")
            .getRawOne()

        const certificadosGenerados = await this.certificadoRepository.count()

        return {
            totalImpactos,
            montoTotal: Number.parseFloat(montoTotal.total) || 0,
            familiasTotales: Number.parseInt(familiasTotales.total) || 0,
            excombatientesTotales: Number.parseInt(excombatientesTotales.total) || 0,
            certificadosGenerados,
        }
    }
}
