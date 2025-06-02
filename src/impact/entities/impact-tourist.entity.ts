import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm"
import { Usuario } from "../../auth/entities/user.entity"

@Entity({ name: 'impacto_turista' })
export class ImpactoTurista {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    descripcion: string;

    @Column('text')
    impacto: string;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(
        () => Usuario,
        (usuario) => usuario.impactoTurista,
        { eager: true }
    )
    @JoinColumn({ name: 'usuarioId' })
    usuario: Usuario

}