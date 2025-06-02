import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"
import { Ruta } from "./ruta.entity"

export enum TipoPunto {
  ARTESANIA = "artesania",
  GASTRONOMIA = "gastronomia",
  MUSICA = "musica",
  MEMORIA_HISTORICA = "memoria_historica",
  NATURALEZA = "naturaleza",
  ALOJAMIENTO = "alojamiento",
}

@Entity("puntos_interes")
export class PuntoInteres {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  nombre: string

  @Column("text")
  descripcion: string

  @Column("decimal", { precision: 10, scale: 8 })
  latitud: number

  @Column("decimal", { precision: 11, scale: 8 })
  longitud: number

  @Column({
    type: "enum",
    enum: TipoPunto,
  })
  tipo: TipoPunto

  @Column({ nullable: true })
  contacto: string

  @Column({ nullable: true })
  telefono: string

  @Column("simple-array", { nullable: true })
  imagenes: string[]

  @Column("decimal", { precision: 10, scale: 2, nullable: true })
  precioPromedio: number

  @Column({ default: true })
  aceptaQr: boolean

  @ManyToOne(
    () => Ruta,
    (ruta) => ruta.puntosInteres,
  )
  @JoinColumn({ name: "rutaId" })
  ruta: Ruta

  @Column()
  rutaId: string
}
