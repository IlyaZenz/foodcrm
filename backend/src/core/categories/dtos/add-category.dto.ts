import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class AddCategoryDto {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsString()
  titleKz: string

  @IsOptional()
  @IsBoolean()
  isActive: boolean
}
