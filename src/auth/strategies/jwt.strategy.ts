import { ExtractJwt, Strategy } from "passport-jwt"
import { PassportStrategy } from "@nestjs/passport"
import { Injectable, UnauthorizedException } from "@nestjs/common"
import type { ConfigService } from "@nestjs/config"
import type { AuthService } from "../auth.service"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        private authService: AuthService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>("JWT_SECRET", "secret-key"),
        })
    }

    async validate(payload: any) {
        const user = await this.authService.findById(payload.sub)
        if (!user) {
            throw new UnauthorizedException()
        }
        return user
    }
}
