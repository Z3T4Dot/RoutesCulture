import { Controller, Get, Post, Body, Param, UseGuards, Request } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"
import type { ImpactoService } from "./impact.service"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"

@ApiTags("Impacto Social")
@Controller("impacto")
export class ImpactoController {
    constructor(private readonly impactoService: ImpactoService) { }

    @Get("estadisticas")
    @ApiOperation({ summary: "Obtener estadísticas generales de impacto" })
    @ApiResponse({ status: 200, description: "Estadísticas obtenidas exitosamente" })
    getEstadisticasGenerales() {
        return this.impactoService.getEstadisticasGenerales()
    }

    @Get(':userId')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obtener impacto social de un usuario específico' })
    @ApiResponse({ status: 200, description: 'Impacto del usuario obtenido exitosamente' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    getImpactoByUser(@Param('userId') userId: string) {
        return this.impactoService.getImpactoByUser(userId);
    }

    @Get('certificados/:userId')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obtener certificados de impacto de un usuario' })
    @ApiResponse({ status: 200, description: 'Certificados obtenidos exitosamente' })
    getCertificadosByUser(@Param('userId') userId: string) {
        return this.impactoService.getCertificadosByUser(userId);
    }

    @Post("registrar")
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Registrar nuevo impacto social" })
    @ApiResponse({ status: 201, description: "Impacto registrado exitosamente" })
    registrarImpacto(@Body() impactoData: any, @Request() req) {
        return this.impactoService.registrarImpacto({
            ...impactoData,
            turistaId: req.user.id,
        })
    }
}
