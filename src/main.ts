import { NestFactory } from "@nestjs/core"
import { ValidationPipe } from "@nestjs/common"
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger"
import { AppModule } from "./app.module"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Configuración global de validación
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  // Configuración de CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle("Rutas Culturales API")
    .setDescription("API para Rutas Culturales de Reconciliación")
    .setVersion("1.0.0")
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("api/docs", app, document)

  const port = process.env.PORT || 3000
  await app.listen(port)
  console.log(`🚀 API running on http://localhost:${port}`)
  console.log(`📚 Documentation available at http://localhost:${port}/api/docs`)
}

bootstrap()
