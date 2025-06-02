import { Controller, Post, Body, UseGuards } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"
import type { NotificacionesService } from "./notifications.service"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"

@ApiTags("Notificaciones")
@Controller("notificaciones")
export class NotificacionesController {
    constructor(private readonly notificacionesService: NotificacionesService) { }

    @Post('sms')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Enviar SMS personalizado' })
    @ApiResponse({ status: 200, description: 'SMS enviado exitosamente' })
    async enviarSMS(@Body() body: { telefono: string; mensaje: string }) {
        const resultado = await this.notificacionesService.enviarSMS(body.telefono, body.mensaje);
        return { enviado: resultado };
    }

    @Post('alerta-zona-remota')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Enviar alerta de zona remota' })
    @ApiResponse({ status: 200, description: 'Alerta enviada exitosamente' })
    async enviarAlertaZonaRemota(@Body() body: { telefono: string; ubicacion: string }) {
        const resultado = await this.notificacionesService.enviarAlertaZonaRemota(body.telefono, body.ubicacion);
        return { enviado: resultado };
    }

    @Post('confirmacion-reserva')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Enviar confirmación de reserva' })
    @ApiResponse({ status: 200, description: 'Confirmación enviada exitosamente' })
    async enviarConfirmacionReserva(@Body() body: { telefono: string; ruta: string; fecha: string }) {
        const resultado = await this.notificacionesService.enviarConfirmacionReserva(
            body.telefono,
            body.ruta,
            body.fecha
        );
        return { enviado: resultado };
    }
}
