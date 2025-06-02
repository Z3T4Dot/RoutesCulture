import { Controller, Get, Param } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger"
import type { ProyectosService } from "./project.service"

@ApiTags("Proyectos Comunitarios")
@Controller("proyectos")
export class ProyectosController {
  constructor(private readonly proyectosService: ProyectosService) {}

  @Get()
  @ApiOperation({ summary: "Obtener todos los proyectos comunitarios activos" })
  @ApiResponse({ status: 200, description: "Lista de proyectos obtenida exitosamente" })
  findAll() {
    return this.proyectosService.findAll()
  }

  @Get("estadisticas")
  @ApiOperation({ summary: "Obtener estadísticas generales de proyectos" })
  @ApiResponse({ status: 200, description: "Estadísticas obtenidas exitosamente" })
  getEstadisticas() {
    return this.proyectosService.getEstadisticas()
  }

  @Get("verificados")
  @ApiOperation({ summary: "Obtener proyectos verificados" })
  @ApiResponse({ status: 200, description: "Proyectos verificados obtenidos exitosamente" })
  findVerificados() {
    return this.proyectosService.findVerificados()
  }

  @Get('tipo/:tipo')
  @ApiOperation({ summary: 'Filtrar proyectos por tipo' })
  @ApiResponse({ status: 200, description: 'Proyectos filtrados por tipo' })
  findByTipo(@Param('tipo') tipo: string) {
    return this.proyectosService.findByTipo(tipo);
  }

  @Get('departamento/:departamento')
  @ApiOperation({ summary: 'Filtrar proyectos por departamento' })
  @ApiResponse({ status: 200, description: 'Proyectos filtrados por departamento' })
  findByDepartamento(@Param('departamento') departamento: string) {
    return this.proyectosService.findByDepartamento(departamento);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle de un proyecto específico' })
  @ApiResponse({ status: 200, description: 'Detalle del proyecto obtenido exitosamente' })
  @ApiResponse({ status: 404, description: 'Proyecto no encontrado' })
  findOne(@Param('id') id: string) {
    return this.proyectosService.findOne(id);
  }
}
