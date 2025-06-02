import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { TipoUsuario } from "../entities/user.entity"

export class RegisterDto {
    @ApiProperty({ example: "usuario@ejemplo.com" })
    @IsEmail()
    email: string

    @ApiProperty({ example: "password123", minLength: 6 })
    @IsString()
    @MinLength(6)
    password: string

    @ApiProperty({ example: "Juan" })
    @IsString()
    nombre: string

    @ApiProperty({ example: "Pérez" })
    @IsString()
    apellido: string

    @ApiProperty({ example: "+57 300 123 4567", required: false })
    @IsOptional()
    @IsString()
    telefono?: string

    @ApiProperty({ enum: TipoUsuario, default: TipoUsuario.TURISTA })
    @IsOptional()
    @IsEnum(TipoUsuario)
    tipo?: TipoUsuario

    @ApiProperty({ example: "Antioquia", required: false })
    @IsOptional()
    @IsString()
    departamento?: string

    @ApiProperty({ example: "Medellín", required: false })
    @IsOptional()
    @IsString()
    municipio?: string
}
