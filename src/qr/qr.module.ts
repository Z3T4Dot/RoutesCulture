import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { QrService } from "./qr.service"
import { QrController } from "./qr.controller"
import { CodigoQR } from "./entities/code-qr.entity"
import { NotificacionesModule } from "../notifications/notifications.module"

@Module({
    imports: [TypeOrmModule.forFeature([CodigoQR]), NotificacionesModule],
    controllers: [QrController],
    providers: [QrService],
    exports: [QrService],
})
export class QrModule { }
