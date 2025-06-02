import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ImpactoService } from "./impact.service"
import { ImpactoController } from "./impact.controller"
import { ImpactoTurista } from "./entities/impact-tourist.entity"
import { CertificadoImpacto } from "./entities/certified-impact.entity"

@Module({
    imports: [TypeOrmModule.forFeature([ImpactoTurista, CertificadoImpacto])],
    controllers: [ImpactoController],
    providers: [ImpactoService],
    exports: [ImpactoService],
})
export class ImpactoModule { }
