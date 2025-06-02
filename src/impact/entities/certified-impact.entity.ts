import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn } from "typeorm"
import { ImpactoTurista } from "./impact-tourist.entity"

@Entity()
export class CertificadoImpacto {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    codigo_verificacion: string

    @OneToOne(() => ImpactoTurista)
    @JoinColumn()
    impacto_turista: ImpactoTurista

    @CreateDateColumn()
    fecha_creacion: Date
}