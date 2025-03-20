import { IsNotEmpty, IsNotIn, IsString } from "class-validator"
import { Transform } from "class-transformer"

// Ожидается объект {login: string}
export class ValidateLoginDto {
  @IsNotIn(["null"])
  @Transform(({ value }) => value.toLowerCase().trim())
  @IsNotEmpty()
  @IsString()
  login: string
}
