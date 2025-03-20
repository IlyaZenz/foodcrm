import {Controller, Delete, Get, Header, Param, ParseIntPipe, Post, Put, Query, UseGuards } from "@nestjs/common"
import { RolesGuard } from "../../auth-users/role.guard"
import { Role } from "../../auth-users/roles.enum"
import { AuthGuard } from "@nestjs/passport"

@UseGuards(RolesGuard([Role.admin, Role.content]))
@UseGuards(AuthGuard("jwt"))
@Controller("orders")
export class OrdersController{

  @Header("content-type", "application/json")
  @Post()
  add() {
  }

  @Header("content-type", "application/json")
  @Get(":id")
  getAll(@Query("start") start?: string,
         @Query("end") end?: string,
         @Query("userId", ParseIntPipe) userId?: number,
         @Query("limit", ParseIntPipe) limit?: number,
         @Query("offset", ParseIntPipe) offset?: number){

  }

  @Header("content-type", "application/json")
  @Get(":id")
  getOne(@Param("id", ParseIntPipe) id: number) {
  }

  @Header("content-type", "application/json")
  @Put(":id")
  update(@Param("id", ParseIntPipe) id: number) {

  }

  @Header("content-type", "application/json")
  @Delete(":id")
  delete(@Param("id", ParseIntPipe) id: number) {

  }

}