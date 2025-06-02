import { Controller, Get, Post, Param, Query, UseGuards, Body } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from "@nestjs/swagger"
import type { RutasService } from "./routes.service"
import type { CreateRutaDto } from "./dto/create-route.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { NivelReconciliacion } from "./entities/ruta.entity"

@ApiTags("Rutas")
@Controller("rutas")
export class RutasController {
    constructor(private readonly rutasService: RutasService) { }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post()
    @ApiOperation({ summary: 'Crear nueva ruta cultural' })
    @ApiResponse({ status: 201, description: 'Ruta creada exitosamente' })
    create(@Body() createRutaDto: CreateRutaDto) {
        return this.rutasService.create(createRutaDto);
    }

    @Get()
    @ApiOperation({ summary: "Obtener todas las rutas activas" })
    @ApiResponse({ status: 200, description: "Lista de rutas obtenida exitosamente" })
    findAll() {
        return this.rutasService.findAll()
    }

    @Get('populares')
    @ApiOperation({ summary: 'Obtener rutas más populares' })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiResponse({ status: 200, description: 'Rutas populares obtenidas exitosamente' })
    getPopulares(@Query('limit') limit?: number) {
        return this.rutasService.getPopulares(limit);
    }

    @Get("nearby")
    @ApiOperation({ summary: "Buscar rutas cercanas a una ubicación" })
    @ApiQuery({ name: "lat", required: true, type: Number })
    @ApiQuery({ name: "lng", required: true, type: Number })
    @ApiQuery({ name: "radius", required: false, type: Number })
    @ApiResponse({ status: 200, description: "Rutas cercanas encontradas" })
    findNearby(@Query('lat') lat: number, @Query('lng') lng: number, @Query('radius') radius?: number) {
        return this.rutasService.findNearby(lat, lng, radius)
    }

    @Get(":departamento")
    @ApiOperation({ summary: "Filtrar rutas por departamento y nivel de reconciliación" })
    @ApiQuery({ name: "nivel", required: false, enum: NivelReconciliacion })
    @ApiResponse({ status: 200, description: "Rutas filtradas obtenidas exitosamente" })
    findByDepartamento(@Param('departamento') departamento: string, @Query('nivel') nivel?: NivelReconciliacion) {
        return this.rutasService.findByDepartamento(departamento, nivel)
    }

    @Get('detalle/:id')
    @ApiOperation({ summary: 'Obtener detalle de una ruta específica' })
    @ApiResponse({ status: 200, description: 'Detalle de ruta obtenido exitosamente' })
    @ApiResponse({ status: 404, description: 'Ruta no encontrada' })
    findOne(@Param('id') id: string) {
        return this.rutasService.findOne(id);
    }
}
