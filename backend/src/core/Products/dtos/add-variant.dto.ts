import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class AddVariantDto {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsNumber()
  @IsOptional()
  price: number
}
