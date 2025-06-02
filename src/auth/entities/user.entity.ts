import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm"
import { Exclude } from "class-transformer"
import { ImpactoTurista } from "../../impact/entities/impact-tourist.entity"

export enum TipoUsuario {
    TURISTA = "turista",
    COMUNIDAD = "comunidad",
    ADMIN = "admin",
}

@Entity("usuarios")
export class Usuario {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ unique: true })
    email: string

    @Column()
    @Exclude()
    password: string

    @Column()
    nombre: string

    @Column()
    apellido: string

    @Column({ nullable: true })
    telefono: string

    @Column({
        type: "enum",
        enum: TipoUsuario,
        default: TipoUsuario.TURISTA,
    })
    tipo: TipoUsuario

    @Column({ nullable: true })
    departamento: string

    @Column({ nullable: true })
    municipio: string

    @Column({ default: true })
    activo: boolean

    @OneToMany(
        () => ImpactoTurista,
        (impacto) => impacto.turista,
    )
    impactos: ImpactoTurista[]

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}
