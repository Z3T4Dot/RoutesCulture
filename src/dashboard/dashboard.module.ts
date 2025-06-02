import { Module } from "@nestjs/common"
import { DashboardService } from "./dashboard.service"
import { DashboardController } from "./dashboard.controller"
import { RutasModule } from "../routes/routes.module"
import { ProyectosModule } from "../projects/project.module"
import { TestimoniosModule } from "../testimonios/testimonios.module"
import { ImpactoModule } from "../impact/impact.module"
import { QrModule } from "../qr/qr.module"

@Module({
    imports: [RutasModule, ProyectosModule, TestimoniosModule, ImpactoModule, QrModule],
    controllers: [DashboardController],
    providers: [DashboardService],
})
export class DashboardModule { }
