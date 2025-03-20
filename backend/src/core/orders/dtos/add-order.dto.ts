import { IsArray, IsEnum, IsNotEmpty, IsNotIn, IsNumber, IsString } from "class-validator"
import { OrderItem } from "../orderItems.entity"

export class addOrderDto {
  @IsNotEmpty()
  @IsNumber()
  totalPrice: number

  @IsNumber()
  paidBonuses: number;

  @IsNotEmpty()
  @IsNumber()
  paidMoney: number;

  @IsNumber()
  accruedBonuses: number;

  @IsNotEmpty()
  @IsArray()
  items: OrderItem[]

  @IsNotEmpty()
  @IsString()
  platform: string

}
