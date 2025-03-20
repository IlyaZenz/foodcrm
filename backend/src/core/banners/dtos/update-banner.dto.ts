import {IsNotEmpty, IsNotIn, IsNumber, IsOptional, IsString } from "class-validator"

export class UpdateBannerDto {
  @IsNumber()
  id: number

  @IsNotIn(["null"])
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  content:string;

  @IsOptional()
  @IsString()
  image?: string;
}