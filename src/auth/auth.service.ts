import { Injectable, UnauthorizedException, ConflictException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import type { JwtService } from "@nestjs/jwt"
import * as bcrypt from "bcryptjs"
import { Usuario } from "./entities/user.entity"
import type { RegisterDto } from "./dto/register.dto"
import type { LoginDto } from "./dto/login.dto"

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Usuario)
        private usuarioRepository: Repository<Usuario>,
        private jwtService: JwtService,
    ) { }

    async register(registerDto: RegisterDto) {
        const { email, password, ...userData } = registerDto

        // Verificar si el usuario ya existe
        const existingUser = await this.usuarioRepository.findOne({ where: { email } })
        if (existingUser) {
            throw new ConflictException("El email ya está registrado")
        }

        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(password, 10)

        // Crear el usuario
        const usuario = this.usuarioRepository.create({
            email,
            password: hashedPassword,
            ...userData,
        })

        await this.usuarioRepository.save(usuario)

        // Generar token
        const payload = { sub: usuario.id, email: usuario.email, tipo: usuario.tipo }
        const token = this.jwtService.sign(payload)

        return {
            access_token: token,
            user: {
                id: usuario.id,
                email: usuario.email,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                tipo: usuario.tipo,
            },
        }
    }

    async login(loginDto: LoginDto) {
        const { email, password } = loginDto

        const usuario = await this.usuarioRepository.findOne({ where: { email } })
        if (!usuario || !(await bcrypt.compare(password, usuario.password))) {
            throw new UnauthorizedException("Credenciales inválidas")
        }

        const payload = { sub: usuario.id, email: usuario.email, tipo: usuario.tipo }
        const token = this.jwtService.sign(payload)

        return {
            access_token: token,
            user: {
                id: usuario.id,
                email: usuario.email,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                tipo: usuario.tipo,
            },
        }
    }

    async validateUser(email: string, password: string): Promise<any> {
        const usuario = await this.usuarioRepository.findOne({ where: { email } })
        if (usuario && (await bcrypt.compare(password, usuario.password))) {
            const { password, ...result } = usuario
            return result
        }
        return null
    }

    async findById(id: string): Promise<Usuario> {
        return this.usuarioRepository.findOne({ where: { id } })
    }
}
