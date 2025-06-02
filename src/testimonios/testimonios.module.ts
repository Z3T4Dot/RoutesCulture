import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { TestimoniosService } from "./testimonios.service"
import { TestimoniosController } from "./testimonios.controller"
import { Testimonio } from "./entity/testimonios.entity"

@Module({
  imports: [TypeOrmModule.forFeature([Testimonio])],
  controllers: [TestimoniosController],
  providers: [TestimoniosService],
  exports: [TestimoniosService],
})
export class TestimoniosModule {}
