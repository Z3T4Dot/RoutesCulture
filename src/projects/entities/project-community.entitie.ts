import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm"

export enum TipoProyecto {
    ARTESANIAS = "artesanias",
    CAFE = "cafe",
    MUSICA = "musica",
    MEMORIA_HISTORICA = "memoria_historica",
    AGRICULTURA = "agricultura",
    TURISMO = "turismo",
}

export enum EstadoProyecto {
    ACTIVO = "activo",
    EN_DESARROLLO = "en_desarrollo",
    PAUSADO = "pausado",
    FINALIZADO = "finalizado",
}

@Entity("proyectos_comunitarios")
export class ProyectoComunitario {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    nombre: string

    @Column("text")
    descripcion: string

    @Column({
        type: "enum",
        enum: TipoProyecto,
    })
    tipo: TipoProyecto

    @Column()
    departamento: string

    @Column()
    municipio: string

    @Column()
    comunidad: string

    @Column("int")
    familiasInvolucradas: number

    @Column("int", { default: 0 })
    excombatientesInvolucrados: number

    @Column({
        type: "enum",
        enum: EstadoProyecto,
        default: EstadoProyecto.ACTIVO,
    })
    estado: EstadoProyecto

    @Column("decimal", { precision: 10, scale: 2, default: 0 })
    ingresosGenerados: number

    @Column("simple-array", { nullable: true })
    imagenes: string[]

    @Column({ nullable: true })
    contactoPrincipal: string

    @Column({ nullable: true })
    telefono: string

    @Column({ nullable: true })
    email: string

    @Column("text", { nullable: true })
    historia: string

    @Column("simple-array", { nullable: true })
    productos: string[]

    @Column("simple-array", { nullable: true })
    servicios: string[]

    @Column({ default: false })
    verificado: boolean

    @Column("date", { nullable: true })
    fechaVerificacion: Date

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}
