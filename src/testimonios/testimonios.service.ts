import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { Testimonio, type TipoTestimonio, type CategoriaTestimonio } from "./entity/testimonios.entity"

@Injectable()
export class TestimoniosService {
  constructor(
    @InjectRepository(Testimonio)
    private readonly testimonioRepository: Repository<Testimonio>,
  ) {}

  async findAll(): Promise<Testimonio[]> {
    return this.testimonioRepository.find({
      where: {
        activo: true,
        permisoPublicacion: true,
      },
      order: { createdAt: "DESC" },
    })
  }

  async findByCategoria(categoria: CategoriaTestimonio): Promise<Testimonio[]> {
    return this.testimonioRepository.find({
      where: {
        categoria,
        activo: true,
        permisoPublicacion: true,
      },
      order: { createdAt: "DESC" },
    })
  }

  async findByTipo(tipo: TipoTestimonio): Promise<Testimonio[]> {
    return this.testimonioRepository.find({
      where: {
        tipo,
        activo: true,
        permisoPublicacion: true,
      },
      order: { createdAt: "DESC" },
    })
  }

  async findDestacados(): Promise<Testimonio[]> {
    return this.testimonioRepository.find({
      where: {
        destacado: true,
        activo: true,
        permisoPublicacion: true,
      },
      order: { reproducciones: "DESC" },
      take: 10,
    })
  }

  async findOne(id: string, userId?: string): Promise<Testimonio> {
    const testimonio = await this.testimonioRepository.findOne({ where: { id } })

    if (!testimonio) {
      throw new NotFoundException("Testimonio no encontrado")
    }

    // Verificar permisos de acceso
    if (!testimonio.permisoPublicacion && !userId) {
      throw new ForbiddenException("Acceso restringido - se requiere autenticación")
    }

    // Incrementar contador de reproducciones
    await this.testimonioRepository.increment({ id }, "reproducciones", 1)

    return testimonio
  }

  async findByDepartamento(departamento: string): Promise<Testimonio[]> {
    return this.testimonioRepository.find({
      where: {
        departamento,
        activo: true,
        permisoPublicacion: true,
      },
      order: { createdAt: "DESC" },
    })
  }

  async search(query: string): Promise<Testimonio[]> {
    return this.testimonioRepository
      .createQueryBuilder("testimonio")
      .where("testimonio.activo = :activo", { activo: true })
      .andWhere("testimonio.permisoPublicacion = :permiso", { permiso: true })
      .andWhere(
        "(testimonio.titulo ILIKE :query OR testimonio.contenido ILIKE :query OR testimonio.autorNombre ILIKE :query)",
        { query: `%${query}%` },
      )
      .orderBy("testimonio.createdAt", "DESC")
      .getMany()
  }

  async getEstadisticas() {
    const total = await this.testimonioRepository.count({
      where: { activo: true, permisoPublicacion: true },
    })

    const porTipo = await this.testimonioRepository
      .createQueryBuilder("testimonio")
      .select("testimonio.tipo", "tipo")
      .addSelect("COUNT(*)", "cantidad")
      .where("testimonio.activo = :activo", { activo: true })
      .andWhere("testimonio.permisoPublicacion = :permiso", { permiso: true })
      .groupBy("testimonio.tipo")
      .getRawMany()

    const porCategoria = await this.testimonioRepository
      .createQueryBuilder("testimonio")
      .select("testimonio.categoria", "categoria")
      .addSelect("COUNT(*)", "cantidad")
      .where("testimonio.activo = :activo", { activo: true })
      .andWhere("testimonio.permisoPublicacion = :permiso", { permiso: true })
      .groupBy("testimonio.categoria")
      .getRawMany()

    const totalReproducciones = await this.testimonioRepository
      .createQueryBuilder("testimonio")
      .select("SUM(testimonio.reproducciones)", "total")
      .where("testimonio.activo = :activo", { activo: true })
      .andWhere("testimonio.permisoPublicacion = :permiso", { permiso: true })
      .getRawOne()

    return {
      total,
      porTipo,
      porCategoria,
      totalReproducciones: Number.parseInt(totalReproducciones.total) || 0,
    }
  }
}
