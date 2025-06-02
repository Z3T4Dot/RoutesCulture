import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm"
import { PuntoInteres } from "./dot-interest.entity"

export enum NivelReconciliacion {
    INICIAL = "inicial",
    INTERMEDIO = "intermedio",
    AVANZADO = "avanzado",
    VERIFICADO = "verificado",
}

@Entity("rutas")
export class Ruta {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    nombre: string

    @Column("text")
    descripcion: string

    @Column()
    departamento: string

    @Column()
    municipio: string

    @Column("decimal", { precision: 10, scale: 8 })
    latitud: number

    @Column("decimal", { precision: 11, scale: 8 })
    longitud: number

    @Column({
        type: "enum",
        enum: NivelReconciliacion,
        default: NivelReconciliacion.INICIAL,
    })
    nivelReconciliacion: NivelReconciliacion

    @Column("int", { default: 0 })
    duracionDias: number

    @Column("decimal", { precision: 10, scale: 2, nullable: true })
    precio: number

    @Column("simple-array", { nullable: true })
    imagenes: string[]

    @Column("text", { nullable: true })
    recomendaciones: string

    @Column({ default: true })
    activa: boolean

    @Column("int", { default: 0 })
    visitasTotal: number

    @OneToMany(
        () => PuntoInteres,
        (punto) => punto.ruta,
    )
    puntosInteres: PuntoInteres[]

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}
