import { Controller, Get, Query, UseGuards } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from "@nestjs/swagger"
import type { DashboardService } from "./dashboard.service"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"

@ApiTags("Dashboard")
@Controller("dashboard")
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) { }

    @Get("comunidades")
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Dashboard principal para comunidades" })
    @ApiResponse({ status: 200, description: "Dashboard obtenido exitosamente" })
    getDashboardComunidades() {
        return this.dashboardService.getDashboardComunidades()
    }

    @Get("reportes/ingresos")
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Reporte de ingresos generados por turistas" })
    @ApiQuery({ name: "fechaInicio", required: false, type: String })
    @ApiQuery({ name: "fechaFin", required: false, type: String })
    @ApiResponse({ status: 200, description: "Reporte de ingresos obtenido exitosamente" })
    getReporteIngresos(@Query('fechaInicio') fechaInicio: string = '', @Query('fechaFin') fechaFin: string = '') {
        return this.dashboardService.getReporteIngresos(fechaInicio, fechaFin)
    }

    @Get("metricas/reconciliacion")
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Métricas de reconciliación y paz" })
    @ApiResponse({ status: 200, description: "Métricas obtenidas exitosamente" })
    getMetricasReconciliacion() {
        return this.dashboardService.getMetricasReconciliacion()
    }
}
