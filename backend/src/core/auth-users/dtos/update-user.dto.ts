import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNotIn,
  IsNumber,
  IsString,
} from "class-validator"
import { Transform } from "class-transformer"
import { Role } from "../roles.enum"

export class UpdateUserDto {
  @IsNumber()
  id: number

  @Transform(({ value }) => value.toLowerCase().trim())
  @IsNotIn(["null"])
  @IsNotEmpty()
  @IsString()
  login: string

  @IsArray()
  @IsEnum(Role, { each: true })
  roles: Role[]
}
