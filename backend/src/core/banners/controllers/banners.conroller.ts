import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from "@nestjs/common"
import { RolesGuard } from "../../auth-users/role.guard"
import { Role } from "../../auth-users/roles.enum"
import { LimitOffsetDto } from "../../../shared/dtos/limit-offset.dto"
import { BannersService } from "../banners.service"
import { AuthGuard } from "@nestjs/passport"
import { AddBannerDto } from "../dtos/add-banner.dto"
import { UpdateBannerDto } from "../dtos/update-banner.dto"
import { FileInterceptor } from "@nestjs/platform-express"
import { fileStorageAndNameTransform } from "../../files/file-storage-and-name-transform.utils"
import { fileFilter } from "../../files/file-ext-filter.utils"
import { FileSharpPipe } from "../../files/file-sharp.pipe"
import { AuthenticatedRequest } from "../../../shared/authenticated-request.interface"

@UseGuards(RolesGuard([Role.admin, Role.content]))
@UseGuards(AuthGuard("jwt"))
@Controller("banners")
export class BannersController {
  constructor(private service: BannersService) {}

  @Header("content-type", "application/json")
  @Post(":id/images")
  @UseInterceptors(
    FileInterceptor("file", {
      fileFilter: fileFilter("image"),
      storage: fileStorageAndNameTransform("banners")
    })
  )
  uploadImage(
    @UploadedFile(new FileSharpPipe({ width: 90, height: 90 }))
    file: Express.Multer.File
  ) {
    console.log(file)
    return file
  }

  @Header("content-type", "application/json")
  @Post()
  add(@Body() data: AddBannerDto) {
    return this.service.add(data)
  }

  @Header("content-type", "application/json")
  @Get(":id")
  get(@Param("id", ParseIntPipe) id: number) {
    return this.service.get(id)
  }

  @Header("content-type", "application/json")
  @Put(":id")
  update(@Param("id", ParseIntPipe) id: number, @Body() data: UpdateBannerDto) {
    return this.service.update(id, data)
  }

  @Header("content-type", "application/json")
  @Get()
  getAll(@Query() query: LimitOffsetDto) {
    return this.service.getAll(query)
  }

  @Header("content-type", "application/json")
  @Delete(":id")
  delete(@Param("id", ParseIntPipe) id: number) {
    return this.service.delete(id)
  }
}
