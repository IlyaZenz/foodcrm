import { IsInt } from "class-validator"
import { Transform } from "class-transformer"

export class LimitOffsetDto {
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  limit: number

  @IsInt()
  @Transform(({ value }) => parseInt(value))
  offset: number
}
