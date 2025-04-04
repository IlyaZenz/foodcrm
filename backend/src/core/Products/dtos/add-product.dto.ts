import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class AddProductDto {
  @IsString()
  @IsNotEmpty()
  title: string
}
