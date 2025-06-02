import { Injectable } from "@nestjs/common"
import type { RutasService } from "../routes/routes.service"
import type { ProyectosService } from "../projects/project.service"
import type { TestimoniosService } from "../testimonios/testimonios.service"
import type { ImpactoService } from "../impact/impact.service"
import type { QrService } from "../qr/qr.service"

@Injectable()
export class DashboardService {
    constructor(
        private rutasService: RutasService,
        private proyectosService: ProyectosService,
        private testimoniosService: TestimoniosService,
        private impactoService: ImpactoService,
        private qrService: QrService,
    ) { }

    async getDashboardComunidades() {
        const [estadisticasProyectos, estadisticasImpacto, estadisticasTestimonios, estadisticasQR, rutasPopulares] =
            await Promise.all([
                this.proyectosService.getEstadisticas(),
                this.impactoService.getEstadisticasGenerales(),
                this.testimoniosService.getEstadisticas(),
                this.qrService.getEstadisticasQR(),
                this.rutasService.getPopulares(5),
            ])

        return {
            resumen: {
                totalProyectos: estadisticasProyectos.totalProyectos,
                familiasImpactadas: estadisticasProyectos.familiasInvolucradas,
                ingresosGenerados: estadisticasProyectos.ingresosGenerados,
                totalTuristas: estadisticasImpacto.totalImpactos,
                certificadosEmitidos: estadisticasImpacto.certificadosGenerados,
            },
            proyectos: estadisticasProyectos,
            impacto: estadisticasImpacto,
            testimonios: estadisticasTestimonios,
            codigosQR: estadisticasQR,
            rutasPopulares,
        }
    }

    async getReporteIngresos(fechaInicio?: string, fechaFin?: string) {
        // Aquí implementarías la lógica para generar reportes de ingresos
        // por rango de fechas, filtros por departamento, etc.

        const estadisticasImpacto = await this.impactoService.getEstadisticasGenerales()

        return {
            periodo: {
                inicio: fechaInicio || "Desde el inicio",
                fin: fechaFin || "Hasta ahora",
            },
            ingresosTotales: estadisticasImpacto.montoTotal,
            familiasBeneficiadas: estadisticasImpacto.familiasTotales,
            excombatientesBeneficiados: estadisticasImpacto.excombatientesTotales,
            transaccionesTotales: estadisticasImpacto.totalImpactos,
        }
    }

    async getMetricasReconciliacion() {
        const [proyectos, testimonios] = await Promise.all([
            this.proyectosService.getEstadisticas(),
            this.testimoniosService.getEstadisticas(),
        ])

        return {
            indicadores: {
                proyectosActivos: proyectos.totalProyectos,
                proyectosVerificados: proyectos.proyectosVerificados,
                excombatientesReintegrados: proyectos.excombatientesInvolucrados,
                testimoniosRecolectados: testimonios.total,
                historiasPorCategoria: testimonios.porCategoria,
            },
            porcentajeVerificacion:
                proyectos.totalProyectos > 0 ? (proyectos.proyectosVerificados / proyectos.totalProyectos) * 100 : 0,
        }
    }
}
