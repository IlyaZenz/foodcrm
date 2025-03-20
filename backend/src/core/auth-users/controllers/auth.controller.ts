import {
  Body,
  Controller,
  Get,
  Header,
  Headers,
  Post,
  Request,
} from "@nestjs/common"
import { AuthUsersService } from "../auth-users.service"
import { AuthenticatedRequest } from "../../../shared/authenticated-request.interface"
import { AddOrLoginUserDto } from "../dtos/add-or-login-user.dto"

@Controller("auth")
export class AuthController {
  constructor(private service: AuthUsersService) {}

  @Header("content-type", "application/json")
  @Post("login")
  login(@Body() data: AddOrLoginUserDto) {
    return this.service.login(data)
  }

  @Header("content-type", "application/json")
  @Get("refresh")
  refresh(
    @Request() req: AuthenticatedRequest,
    @Headers("authorization") token: string,
  ) {
    return this.service.refreshTokens(token)
  }
}
