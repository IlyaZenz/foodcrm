import { IsNotEmpty, IsNotIn, IsString } from "class-validator"
import { Transform } from "class-transformer"

export class AddOrLoginUserDto {
  @Transform(({ value }) => value.toLowerCase().trim())
  @IsNotIn(["null"])
  @IsNotEmpty()
  @IsString()
  login: string

  @Transform(({ value }) => value.trim())
  @IsNotIn(["null"])
  @IsNotEmpty()
  @IsString()
  password: string

}
