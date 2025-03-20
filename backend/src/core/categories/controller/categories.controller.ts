import {
  Body,
  Controller, Delete,
  Get,
  Header,
  Post,
  Put,
  Query,
  UseGuards
} from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import { CategoriesService } from "../categories.service"
import { RolesGuard } from "../../auth-users/role.guard"
import { Role } from "../../auth-users/roles.enum"
import { LimitOffsetDto } from "../../../shared/dtos/limit-offset.dto"
import { AddBannerDto } from "../../banners/dtos/add-banner.dto"
import { AddCategoryDto } from "../dtos/add-category.dto"

@UseGuards(AuthGuard("jwt"))
@Controller("categories")
export class CategoriesController {
  constructor(private service: CategoriesService) {}

  @Header("content-type", "application/json")
  @Post()
  add(@Body() data: AddCategoryDto) {
    return this.service.add(data)
  }

  @Header("content-type", "application/json")
  @Post()
  addImage() {}

  @Header("content-type", "application/json")
  @Get()
  getAll(@Query() query: LimitOffsetDto) {
    return this.service.getAll(query)
  }

  // @Header("content-type", "application/json")
  // @Get()
  // checkExisting() {}

  @Header("content-type", "application/json")
  @Get(":url")
  getOne() {}

  @Header("content-type", "application/json")
  @Put()
  update() {}

  @Header("content-type", "application/json")
  @Put()
  updateImage() {}

  @Header("content-type", "application/json")
  @Delete()
  delete() {}

  @Header("content-type", "application/json")
  @Delete()
  deleteImage() {}
}
