import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { ProyectoComunitario, type TipoProyecto, EstadoProyecto } from "./entities/project-community.entitie"

@Injectable()
export class ProyectosService {
    private proyectoRepository: Repository<ProyectoComunitario>

    constructor(
        @InjectRepository(ProyectoComunitario)
        proyectoRepository: Repository<ProyectoComunitario>,
    ) {
        this.proyectoRepository = proyectoRepository;
    }

    async findAll(): Promise<ProyectoComunitario[]> {
        return this.proyectoRepository.find({
            where: { estado: EstadoProyecto.ACTIVO },
            order: { createdAt: "DESC" },
        })
    }

    async findByTipo(tipo: TipoProyecto): Promise<ProyectoComunitario[]> {
        return this.proyectoRepository.find({
            where: { tipo, estado: EstadoProyecto.ACTIVO },
            order: { createdAt: "DESC" },
        })
    }

    async findByDepartamento(departamento: string): Promise<ProyectoComunitario[]> {
        return this.proyectoRepository.find({
            where: { departamento, estado: EstadoProyecto.ACTIVO },
            order: { createdAt: "DESC" },
        })
    }

    async findVerificados(): Promise<ProyectoComunitario[]> {
        return this.proyectoRepository.find({
            where: { verificado: true, estado: EstadoProyecto.ACTIVO },
            order: { fechaVerificacion: "DESC" },
        })
    }

    async findOne(id: string): Promise<ProyectoComunitario> {
        const proyecto = await this.proyectoRepository.findOne({ where: { id } })
        if (!proyecto) {
            throw new NotFoundException("Proyecto no encontrado")
        }
        return proyecto
    }

    async getEstadisticas() {
        const total = await this.proyectoRepository.count({ where: { estado: EstadoProyecto.ACTIVO } })
        const verificados = await this.proyectoRepository.count({
            where: { verificado: true, estado: EstadoProyecto.ACTIVO },
        })

        const familiasTotales = await this.proyectoRepository
            .createQueryBuilder("proyecto")
            .select("SUM(proyecto.familiasInvolucradas)", "total")
            .where("proyecto.estado = :estado", { estado: EstadoProyecto.ACTIVO })
            .getRawOne()

        const excombatientesTotales = await this.proyectoRepository
            .createQueryBuilder("proyecto")
            .select("SUM(proyecto.excombatientesInvolucrados)", "total")
            .where("proyecto.estado = :estado", { estado: EstadoProyecto.ACTIVO })
            .getRawOne()

        const ingresosTotales = await this.proyectoRepository
            .createQueryBuilder("proyecto")
            .select("SUM(proyecto.ingresosGenerados)", "total")
            .where("proyecto.estado = :estado", { estado: EstadoProyecto.ACTIVO })
            .getRawOne()

        return {
            totalProyectos: total,
            proyectosVerificados: verificados,
            familiasInvolucradas: Number.parseInt(familiasTotales.total) || 0,
            excombatientesInvolucrados: Number.parseInt(excombatientesTotales.total) || 0,
            ingresosGenerados: Number.parseFloat(ingresosTotales.total) || 0,
        }
    }
}
