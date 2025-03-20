import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { BannersService } from "./banners.service"
import { BannersController } from "./controllers/banners.conroller"
import { Banner } from "./banners.entity"

@Module({
  imports: [
    TypeOrmModule.forFeature([Banner]),
  ],
  providers: [BannersService],
  // TODO public controller
  controllers: [BannersController],
})
export class BannersModule {}