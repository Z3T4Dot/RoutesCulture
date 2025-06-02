import { Controller, Post, Body } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger"
import type { AuthService } from "./auth.service"
import type { RegisterDto } from "./dto/register.dto"
import type { LoginDto } from "./dto/login.dto"

@ApiTags("Autenticación")
@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    @ApiOperation({ summary: 'Registrar nuevo usuario' })
    @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente' })
    @ApiResponse({ status: 409, description: 'Email ya registrado' })
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post('login')
    @ApiOperation({ summary: 'Iniciar sesión' })
    @ApiResponse({ status: 200, description: 'Login exitoso' })
    @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }
}
