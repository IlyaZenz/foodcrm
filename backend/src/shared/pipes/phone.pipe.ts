import { IsNumberString, Length, validateOrReject } from "class-validator"
import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common"
import { plainToClass } from "class-transformer"

class PhoneValidation {
  @Length(10, 10)
  @IsNumberString()
  phone: string
}

@Injectable()
export class ValidatePhonePipe implements PipeTransform {
  async transform(value: string) {
    const phone = plainToClass(PhoneValidation, { phone: value.trim() })
    try {
      await validateOrReject(phone)
    } catch (errors) {
      throw new BadRequestException("Invalid phone number")
    }
    return value
  }
}
