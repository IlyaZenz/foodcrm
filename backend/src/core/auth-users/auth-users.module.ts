import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { User } from "./user.entity"
import { AuthUsersService } from "./auth-users.service"
import { AuthController } from "./controllers/auth.controller"
import { UsersController } from "./controllers/users.controller"
import { PassportModule } from "@nestjs/passport"
import { JwtModule } from "@nestjs/jwt"
import { jwtSecret } from "../../configs/auth.config"
import { JwtStrategy } from "./jwt.strategy"

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.register({ secret: jwtSecret }),
  ],
  providers: [AuthUsersService, JwtStrategy],
  controllers: [AuthController, UsersController],
})
export class AuthUsersModule {}
