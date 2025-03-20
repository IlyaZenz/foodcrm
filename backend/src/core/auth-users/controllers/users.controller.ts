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
  Request,
  UseGuards,
} from "@nestjs/common"
import { AuthUsersService } from "../auth-users.service"
import { AddOrLoginUserDto } from "../dtos/add-or-login-user.dto"
import { AuthGuard } from "@nestjs/passport"
import { RolesGuard } from "../role.guard"
import { UpdatePasswordDto } from "../dtos/update-password.dto"
import { UpdateUserDto } from "../dtos/update-user.dto"
import { AuthenticatedRequest } from "../../../shared/authenticated-request.interface"
import { LimitOffsetDto } from "../../../shared/dtos/limit-offset.dto"
import { ValidateLoginDto } from "../dtos/validate-login.dto"
import { Role } from "../roles.enum"

@UseGuards(AuthGuard("jwt"))
@Controller("users")
export class UsersController {
  constructor(private service: AuthUsersService) {}

  @Header("content-type", "application/json")
  @Post("has-login")
  validateLogin(@Body() query: ValidateLoginDto) {
    return this.service.validateLogin(query.login)
  }

  @Header("content-type", "application/json")
  @UseGuards(RolesGuard([Role.admin]))
  @Post()
  add(@Body() data: AddOrLoginUserDto) {
    return this.service.add(data)
  }

  @Header("content-type", "application/json")
  @UseGuards(RolesGuard([Role.admin]))
  @Get(":id")
  get(@Param("id", ParseIntPipe) id: number) {
    return this.service.get(id)
  }

  @Header("content-type", "application/json")
  @UseGuards(RolesGuard([Role.admin]))
  @Get()
  getAll(@Query() query: LimitOffsetDto) {
    return this.service.getAll(query)
  }

  @Header("content-type", "application/json")
  @UseGuards(RolesGuard([Role.admin]))
  @Put(":id/password")
  updatePassword(
    @Param("id", ParseIntPipe) id: number,
    @Body() data: UpdatePasswordDto,
  ) {
    return this.service.updatePassword(id, data)
  }

  @Header("content-type", "application/json")
  @UseGuards(RolesGuard([Role.admin]))
  @Put(":id")
  update(@Param("id", ParseIntPipe) id: number, @Body() data: UpdateUserDto) {
    return this.service.update(id, data)
  }

  @Header("content-type", "application/json")
  @UseGuards(RolesGuard([Role.admin]))
  @Delete(":id")
  delete(
    @Param("id", ParseIntPipe) id: number,
    @Request() req: AuthenticatedRequest,
  ) {
    // запрет администратору удалять свою учетную запись
    return req.user.id === id ? false : this.service.delete(id)
  }
}
