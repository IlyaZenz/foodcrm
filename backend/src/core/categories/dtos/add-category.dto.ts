import { IsBoolean, IsNotEmpty, IsString } from "class-validator"

export class AddCategoryDto {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsString()
  titleKz: string // обязательное???

  @IsBoolean()
  isActive: boolean
}
