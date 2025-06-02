import { IsString, IsNumber, IsEnum, IsOptional, IsArray, IsBoolean } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { NivelReconciliacion } from "../entities/ruta.entity"

export class CreateRutaDto {
    @ApiProperty({ example: "Ruta Café y Perdón" })
    @IsString()
    nombre: string

    @ApiProperty({ example: "Una experiencia única de reconciliación a través del café" })
    @IsString()
    descripcion: string

    @ApiProperty({ example: "Antioquia" })
    @IsString()
    departamento: string

    @ApiProperty({ example: "Granada" })
    @IsString()
    municipio: string

    @ApiProperty({ example: 5.8167 })
    @IsNumber()
    latitud: number

    @ApiProperty({ example: -75.2167 })
    @IsNumber()
    longitud: number

    @ApiProperty({ enum: NivelReconciliacion })
    @IsEnum(NivelReconciliacion)
    nivelReconciliacion: NivelReconciliacion

    @ApiProperty({ example: 3 })
    @IsNumber()
    duracionDias: number

    @ApiProperty({ example: 250000, required: false })
    @IsOptional()
    @IsNumber()
    precio?: number

    @ApiProperty({ example: ["imagen1.jpg", "imagen2.jpg"], required: false })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    imagenes?: string[]

    @ApiProperty({ example: "Llevar ropa cómoda y protector solar", required: false })
    @IsOptional()
    @IsString()
    recomendaciones?: string

    @ApiProperty({ example: true, required: false })
    @IsOptional()
    @IsBoolean()
    activa?: boolean
}
