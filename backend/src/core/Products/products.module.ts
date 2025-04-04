import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Product } from "./products.entity"
import { ProductsController } from "./controller/products.controller"
import { ProductsService } from "./products.service"
import { ProductVariant } from "./productVariant.entity"


@Module({
  imports: [
    TypeOrmModule.forFeature([Product,ProductVariant]),
  ],
  providers: [ProductsService],
  // TODO public controller
  controllers: [ProductsController],
})
export class ProductsModule {}