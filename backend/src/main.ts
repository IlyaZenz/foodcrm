import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { ValidationPipe } from "@nestjs/common"
import { join } from "path"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix("api")
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  )
  global.__basedir = join(__dirname, '..');

  if (process.env.NODE_ENV === "dev") {
    app.enableCors()
  }
  await app.listen(
    process.env.PORT || process.env.NODE_ENV === "prod" ? 3005 : 3000,
  )
}

bootstrap()
