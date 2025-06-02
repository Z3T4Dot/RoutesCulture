import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { NotificacionesService } from "./notifications.service"
import { NotificacionesController } from "./notifications.controller"

@Module({
  imports: [ConfigModule],
  controllers: [NotificacionesController],
  providers: [NotificacionesService],
  exports: [NotificacionesService],
})
export class NotificacionesModule {}
