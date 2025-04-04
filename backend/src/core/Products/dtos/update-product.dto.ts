import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class UpdateProductDto {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsOptional()
  @IsBoolean()
  isActive: boolean

  @IsOptional()
  @IsBoolean()
  isNew: boolean

  @IsOptional()
  @IsBoolean()
  isFavorite: boolean
}
