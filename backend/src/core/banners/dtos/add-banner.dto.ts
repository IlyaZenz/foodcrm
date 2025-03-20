import { IsNotEmpty, IsNotIn, IsOptional, IsString } from "class-validator"

export class AddBannerDto {
  @IsNotIn(["null"])
  @IsNotEmpty()
  @IsString()
  title: string;
}