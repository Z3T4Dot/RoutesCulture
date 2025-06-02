import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { RutasService } from "./routes.service"
import { RutasController } from "./routes.controller"
import { Ruta } from "./entities/ruta.entity"
import { PuntoInteres } from "./entities/dot-interest.entity"

@Module({
    imports: [TypeOrmModule.forFeature([Ruta, PuntoInteres])],
    controllers: [RutasController],
    providers: [RutasService],
    exports: [RutasService],
})
export class RutasModule { }
