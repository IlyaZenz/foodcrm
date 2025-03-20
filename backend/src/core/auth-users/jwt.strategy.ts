import { Injectable, UnauthorizedException } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { jwtSecret } from "../../configs/auth.config"
import { AuthUsersService } from "./auth-users.service"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private auth: AuthUsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecret,
    })
  }

  async validate(payload: any): Promise<any> {
    const user = await this.auth.validateJWT(payload)
    if (!user) {
      throw new UnauthorizedException()
    }
    return { ...user, ...payload }
  }
}
