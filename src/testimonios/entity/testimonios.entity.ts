import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm"

export enum TipoTestimonio {
  AUDIO = "audio",
  TEXTO = "texto",
  VIDEO = "video",
}

export enum CategoriaTestimonio {
  RECONCILIACION = "reconciliacion",
  EMPRENDIMIENTO = "emprendimiento",
  CULTURA = "cultura",
  MEMORIA_HISTORICA = "memoria_historica",
  TRANSFORMACION = "transformacion",
}

@Entity("testimonios")
export class Testimonio {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  titulo: string

  @Column("text", { nullable: true })
  contenido: string

  @Column({
    type: "enum",
    enum: TipoTestimonio,
  })
  tipo: TipoTestimonio

  @Column({
    type: "enum",
    enum: CategoriaTestimonio,
  })
  categoria: CategoriaTestimonio

  @Column({ nullable: true })
  archivoUrl: string

  @Column()
  autorNombre: string

  @Column({ nullable: true })
  autorEdad: number

  @Column()
  departamento: string

  @Column()
  municipio: string

  @Column({ default: false })
  permisoPublicacion: boolean

  @Column({ default: false })
  permisoComercial: boolean

  @Column("date", { nullable: true })
  fechaPermiso: Date

  @Column({ default: true })
  activo: boolean

  @Column({ default: false })
  destacado: boolean

  @Column("int", { default: 0 })
  reproducciones: number

  @Column("simple-array", { nullable: true })
  tags: string[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
