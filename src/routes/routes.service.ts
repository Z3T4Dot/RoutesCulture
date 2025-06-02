import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { Ruta, type NivelReconciliacion } from "./entities/ruta.entity"
import type { CreateRutaDto } from "./dto/create-route.dto"

@Injectable()
export class RutasService {
    private rutaRepository: Repository<Ruta>

    constructor(
        @InjectRepository(Ruta)
        rutaRepository: Repository<Ruta>,
    ) {
        this.rutaRepository = rutaRepository
    }

    async create(createRutaDto: CreateRutaDto): Promise<Ruta> {
        const ruta = this.rutaRepository.create(createRutaDto)
        return this.rutaRepository.save(ruta)
    }

    async findByDepartamento(departamento: string, nivelReconciliacion?: NivelReconciliacion): Promise<Ruta[]> {
        const query = this.rutaRepository
            .createQueryBuilder("ruta")
            .leftJoinAndSelect("ruta.puntosInteres", "puntos")
            .where("ruta.departamento = :departamento", { departamento })
            .andWhere("ruta.activa = :activa", { activa: true })

        if (nivelReconciliacion) {
            query.andWhere("ruta.nivelReconciliacion = :nivel", { nivel: nivelReconciliacion })
        }

        return query.getMany()
    }

    async findAll(): Promise<Ruta[]> {
        return this.rutaRepository.find({
            where: { activa: true },
            relations: ["puntosInteres"],
            order: { createdAt: "DESC" },
        })
    }

    async findOne(id: string): Promise<Ruta> {
        const ruta = await this.rutaRepository.findOne({
            where: { id },
            relations: ["puntosInteres"],
        })

        if (!ruta) {
            throw new NotFoundException("Ruta no encontrada")
        }

        // Incrementar contador de visitas
        await this.rutaRepository.increment({ id }, "visitasTotal", 1)

        return ruta
    }

    async findNearby(lat: number, lng: number, radius = 50): Promise<Ruta[]> {
        // Búsqueda aproximada por coordenadas (sin PostGIS)
        const latRange = radius / 111 // Aproximadamente 1 grado = 111 km
        const lngRange = radius / (111 * Math.cos((lat * Math.PI) / 180))

        return this.rutaRepository
            .createQueryBuilder("ruta")
            .leftJoinAndSelect("ruta.puntosInteres", "puntos")
            .where("ruta.latitud BETWEEN :latMin AND :latMax", {
                latMin: lat - latRange,
                latMax: lat + latRange,
            })
            .andWhere("ruta.longitud BETWEEN :lngMin AND :lngMax", {
                lngMin: lng - lngRange,
                lngMax: lng + lngRange,
            })
            .andWhere("ruta.activa = :activa", { activa: true })
            .getMany()
    }

    async getPopulares(limit = 10): Promise<Ruta[]> {
        return this.rutaRepository.find({
            where: { activa: true },
            relations: ["puntosInteres"],
            order: { visitasTotal: "DESC" },
            take: limit,
        })
    }
}
