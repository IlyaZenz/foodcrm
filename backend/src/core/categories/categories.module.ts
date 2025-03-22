import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Category } from "./categorie.entity"
import { CategoriesService } from "./categories.service"
import { CategoriesController } from "./controller/categories.controller"

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
  ],
  providers: [CategoriesService],
  // TODO public controller
  controllers: [CategoriesController],
})
export class CategoriesModule {}