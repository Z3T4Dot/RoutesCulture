import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ProyectosService } from "./project.service"
import { ProyectosController } from "./project.controller"
import { ProyectoComunitario } from "./entities/project-community.entitie"

@Module({
    imports: [TypeOrmModule.forFeature([ProyectoComunitario])],
    controllers: [ProyectosController],
    providers: [ProyectosService],
    exports: [ProyectosService],
})
export class ProyectosModule { }
