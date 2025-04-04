import {
  Body,
  Controller, Delete,
  Get,
  Header,
  Param,
  Post, Put,
  Query
} from "@nestjs/common"
import { ProductsService } from "../products.service"
import { AddCategoryDto } from "../../categories/dtos/add-category.dto"
import { AddProductDto } from "../dtos/add-product.dto"
import { LimitOffsetDto } from "../../../shared/dtos/limit-offset.dto"
import { UpdateProductDto } from "../dtos/update-product.dto"
import { AddVariantDto } from "../dtos/add-variant.dto"

@Controller("products")
export class ProductsController {
  constructor(private service: ProductsService) {}

  @Header("content-type", "application/json")
  @Post()
  add(@Body() data: AddProductDto) {
    return this.service.add(data)
  }

  @Header("content-type", "application/json")
  @Post(":id")
  addProductVariant(@Param('id') id: number, @Body() data: AddVariantDto){
    return this.service.addProductVariant(id,data)
  }

  @Header("content-type", "application/json")
  @Get()
  getAll(@Query() query: LimitOffsetDto, @Query("category") category?: string) {
    return this.service.getAll(query,category)
  }

  @Header("content-type", "application/json")
  @Get(":url")
  getOne(@Param("url") url: string) {
    return this.service.getOne(url)
  }

  @Header("content-type", "application/json")
  @Put(":id")
  update(@Param('id') id: number,@Body() data: UpdateProductDto) {
    return this.service.update(id, data)
  }

  @Header("content-type", "application/json")
  @Delete(":id")
  delete(@Param('id') id: number) {
    return this.service.delete(id)
  }

  @Header("content-type", "application/json")
  @Delete("variants/:id")
  deleteVariants(@Param('id') id: number) {
    return this.service.deleteVariant(id)
  }
}
