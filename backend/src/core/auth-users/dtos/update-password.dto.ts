import { IsNotEmpty, IsNotIn, IsString } from "class-validator"
import { Transform } from "class-transformer"

export class UpdatePasswordDto {
  @Transform(({ value }) => value.trim())
  @IsNotIn(["null"])
  @IsNotEmpty()
  @IsString()
  password: string
}
