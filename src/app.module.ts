import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AuthModule } from "./auth/auth.module"
import { RutasModule } from "./routes/routes.module"
import { ProyectosModule } from "./projects/project.module"
import { TestimoniosModule } from "./testimonios/testimonios.module"
import { ImpactoModule } from "./impact/impact.module"
import { NotificacionesModule } from "./notifications/notifications.module"
import { QrModule } from "./qr/qr.module"
import { DashboardModule } from "./dashboard/dashboard.module"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get("DB_HOST", "localhost"),
        port: configService.get("DB_PORT", 5432),
        username: configService.get("DB_USERNAME", "postgres"),
        password: configService.get("DB_PASSWORD", "password"),
        database: configService.get("DB_NAME", "rutas_culturales"),
        entities: [__dirname + "/**/*.entity{.ts,.js}"],
        synchronize: configService.get("NODE_ENV") !== "production",
        logging: configService.get("NODE_ENV") === "development",
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    RutasModule,
    ProyectosModule,
    TestimoniosModule,
    ImpactoModule,
    NotificacionesModule,
    QrModule,
    DashboardModule,
  ],
})
export class AppModule {}
