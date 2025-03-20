import { Controller,  Header, Post,UseGuards } from "@nestjs/common"
import { RolesGuard } from "../../auth-users/role.guard"
import { Role } from "../../auth-users/roles.enum"
import { AuthGuard } from "@nestjs/passport"

@UseGuards(RolesGuard([Role.admin, Role.content]))
@UseGuards(AuthGuard("jwt"))
@Controller("public/orders")
export class OrdersPublicController {

  @Header("content-type", "application/json")
  @Post()
  add() {
  }

}