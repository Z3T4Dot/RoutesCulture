import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm"

export enum EstadoQR {
    ACTIVO = "activo",
    USADO = "usado",
    EXPIRADO = "expirado",
    CANCELADO = "cancelado",
}

@Entity("codigos_qr")
export class CodigoQR {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ unique: true })
    codigo: string

    @Column()
    usuarioId: string

    @Column({ nullable: true })
    rutaId: string

    @Column("decimal", { precision: 5, scale: 2 })
    porcentajeDescuento: number

    @Column("decimal", { precision: 10, scale: 2, nullable: true })
    montoMaximoDescuento: number

    @Column({
        type: "enum",
        enum: EstadoQR,
        default: EstadoQR.ACTIVO,
    })
    estado: EstadoQR

    @Column("timestamp")
    fechaExpiracion: Date

    @Column("int", { default: 0 })
    vecesUsado: number

    @Column("int", { default: 1 })
    usoMaximo: number

    @Column("simple-array", { nullable: true })
    negociosValidos: string[]

    @Column()
    departamento: string

    @Column()
    municipio: string

    @Column("text", { nullable: true })
    descripcion: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}
