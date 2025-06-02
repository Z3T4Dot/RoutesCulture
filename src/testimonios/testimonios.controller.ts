import { Controller, Get, Param, Query, UseGuards, Request } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from "@nestjs/swagger"
import type { TestimoniosService } from "./testimonios.service"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import type { TipoTestimonio, CategoriaTestimonio } from "./entity/testimonios.entity"

@ApiTags("Testimonios")
@Controller("testimonios")
export class TestimoniosController {
    constructor(private readonly testimoniosService: TestimoniosService) { }

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Obtener todos los testimonios (requiere autenticación)" })
    @ApiResponse({ status: 200, description: "Lista de testimonios obtenida exitosamente" })
    @ApiResponse({ status: 401, description: "No autorizado" })
    findAll() {
        return this.testimoniosService.findAll()
    }

    @Get("publicos")
    @ApiOperation({ summary: "Obtener testimonios públicos sin autenticación" })
    @ApiResponse({ status: 200, description: "Testimonios públicos obtenidos exitosamente" })
    findPublicos() {
        return this.testimoniosService.findAll()
    }

    @Get("destacados")
    @ApiOperation({ summary: "Obtener testimonios destacados" })
    @ApiResponse({ status: 200, description: "Testimonios destacados obtenidos exitosamente" })
    findDestacados() {
        return this.testimoniosService.findDestacados()
    }

    @Get("estadisticas")
    @ApiOperation({ summary: "Obtener estadísticas de testimonios" })
    @ApiResponse({ status: 200, description: "Estadísticas obtenidas exitosamente" })
    getEstadisticas() {
        return this.testimoniosService.getEstadisticas()
    }

    @Get('buscar')
    @ApiOperation({ summary: 'Buscar testimonios por texto' })
    @ApiQuery({ name: 'q', required: true, description: 'Término de búsqueda' })
    @ApiResponse({ status: 200, description: 'Resultados de búsqueda obtenidos' })
    search(@Query('q') query: string) {
        return this.testimoniosService.search(query);
    }

    @Get('categoria/:categoria')
    @ApiOperation({ summary: 'Filtrar testimonios por categoría' })
    @ApiResponse({ status: 200, description: 'Testimonios filtrados por categoría' })
    findByCategoria(@Param('categoria') categoria: CategoriaTestimonio) {
        return this.testimoniosService.findByCategoria(categoria);
    }

    @Get('tipo/:tipo')
    @ApiOperation({ summary: 'Filtrar testimonios por tipo' })
    @ApiResponse({ status: 200, description: 'Testimonios filtrados por tipo' })
    findByTipo(@Param('tipo') tipo: TipoTestimonio) {
        return this.testimoniosService.findByTipo(tipo);
    }

    @Get('departamento/:departamento')
    @ApiOperation({ summary: 'Filtrar testimonios por departamento' })
    @ApiResponse({ status: 200, description: 'Testimonios filtrados por departamento' })
    findByDepartamento(@Param('departamento') departamento: string) {
        return this.testimoniosService.findByDepartamento(departamento);
    }

    @Get(":id")
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Obtener detalle de un testimonio específico" })
    @ApiResponse({ status: 200, description: "Detalle del testimonio obtenido exitosamente" })
    @ApiResponse({ status: 404, description: "Testimonio no encontrado" })
    @ApiResponse({ status: 403, description: "Acceso restringido" })
    findOne(@Param('id') id: string, @Request() req) {
        return this.testimoniosService.findOne(id, req.user?.id)
    }
}