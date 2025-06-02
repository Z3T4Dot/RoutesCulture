import { Controller, Get, Post, Body, UseGuards, Request } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"
import type { QrService } from "./qr.service"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"

@ApiTags("Códigos QR")
@Controller("qr")
export class QrController {
    constructor(private readonly qrService: QrService) { }

    @Post("generar")
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Generar nuevo código QR para descuentos" })
    @ApiResponse({ status: 201, description: "Código QR generado exitosamente" })
    async generarCodigoQR(
        @Request() req,
        @Body() body: { rutaId: string; departamento: string; municipio: string; telefono?: string },
    ) {
        return this.qrService.generarCodigoQR(req.user.id, body.rutaId, body.departamento, body.municipio, body.telefono)
    }

    @Post('validar')
    @ApiOperation({ summary: 'Validar código QR' })
    @ApiResponse({ status: 200, description: 'Validación realizada exitosamente' })
    async validarCodigoQR(@Body() body: { codigo: string; negocioId?: string }) {
        return this.qrService.validarCodigoQR(body.codigo, body.negocioId);
    }

    @Post('usar')
    @ApiOperation({ summary: 'Usar código QR para aplicar descuento' })
    @ApiResponse({ status: 200, description: 'Código QR procesado exitosamente' })
    async usarCodigoQR(@Body() body: { codigo: string; monto: number; negocioId?: string }) {
        return this.qrService.usarCodigoQR(body.codigo, body.monto, body.negocioId);
    }

    @Get('mis-codigos')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obtener códigos QR del usuario autenticado' })
    @ApiResponse({ status: 200, description: 'Códigos QR obtenidos exitosamente' })
    async getMisCodigosQR(@Request() req) {
        return this.qrService.getCodigosByUser(req.user.id);
    }

    @Get("estadisticas")
    @ApiOperation({ summary: "Obtener estadísticas de códigos QR" })
    @ApiResponse({ status: 200, description: "Estadísticas obtenidas exitosamente" })
    getEstadisticasQR() {
        return this.qrService.getEstadisticasQR()
    }
}
