import { Injectable, UnauthorizedException } from "@nestjs/common"
import { AddOrLoginUserDto } from "./dtos/add-or-login-user.dto"
import { InjectRepository } from "@nestjs/typeorm"
import { User } from "./user.entity"
import { DeleteResult, Repository } from "typeorm"
import * as bcrypt from "bcrypt"
import { UpdatePasswordDto } from "./dtos/update-password.dto"
import { UpdateUserDto } from "./dtos/update-user.dto"
import { LimitOffsetDto } from "../../shared/dtos/limit-offset.dto"
import {
  accessTokenExpiresInTime,
  adminRefreshTokenExpiresIn,
  jwtSecret
} from "../../configs/auth.config"
import { Role } from "./roles.enum"
import { JwtService } from "@nestjs/jwt"

export interface TokensGeneratedData {
  payload: TokenPayload
  accessTokenExpiresIn: number | string
  refreshTokenExpiresIn: number | string
}

export interface TokenPayload {
  sub: number
  id: number
  roles: Role[]
}

export interface TokenResponseData {
  accessToken: string
  refreshToken: string
}

@Injectable()
export class AuthUsersService {
  constructor(
    @InjectRepository(User) private repo: Repository<User>,
    private readonly jwt: JwtService
  ) {}

  async login(data: AddOrLoginUserDto): Promise<TokenResponseData> {
    const user: User = await this.repo.findOne({ where: { login: data.login } })
    if (!user) {
      throw new UnauthorizedException("Invalid data credentials")
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password)
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid data credentials")
    }

    const {
      payload,
      accessTokenExpiresIn,
      refreshTokenExpiresIn
    }: TokensGeneratedData = this.generateTokenData(user)

    return {
      accessToken: this.jwt.sign(payload, {
        expiresIn: accessTokenExpiresIn
      }),
      refreshToken: this.jwt.sign(payload, {
        expiresIn: refreshTokenExpiresIn
      })
    }
  }

  async refreshTokens(token: string) {
    if (!token) {
      throw new UnauthorizedException("Token not found")
    }

    const prefix = "Bearer "
    if (token.startsWith(prefix)) {
      token = token.slice(prefix.length, token.length)
    }

    if (!this.jwt.verify(token, { secret: jwtSecret })) {
      throw new UnauthorizedException("Token is not verified")
    }

    const decodedToken: TokenPayload = this.jwt.decode(token, {})

    const user: User = await this.repo
      .createQueryBuilder("user")
      .select(["user.id", "user.password", "user.roles"])
      .where({ id: decodedToken.id })
      .getOne()

    if (!user) {
      throw new UnauthorizedException("Invalid data credentials")
    }

    const {
      payload,
      accessTokenExpiresIn,
      refreshTokenExpiresIn
    }: TokensGeneratedData = this.generateTokenData(user)

    return {
      accessToken: this.jwt.sign(payload, {
        expiresIn: accessTokenExpiresIn
      }),
      refreshToken: this.jwt.sign(payload, {
        expiresIn: refreshTokenExpiresIn
      })
    }
  }

  async validateJWT(
    payload: unknown & { sub: number; id: number }
  ): Promise<Omit<User, "password">> {
    const id = payload.sub
    if (!id) {
      throw new UnauthorizedException()
    }

    const user: User = await this.repo
      .createQueryBuilder("user")
      .select(["user.id", "user.password", "user.roles"])
      .where({ id })
      .getOne()

    if (!user) {
      throw new UnauthorizedException()
    }

    const { password, ...existedUser } = user
    return existedUser
  }

  async add(data: AddOrLoginUserDto): Promise<Omit<User, "password">> {
    if (await this.validateLogin(data.login)) {
      throw new Error("User with this login already exists")
    }

    data.password = await this.generateHashPassword(data.password)

    const { password, ...user }: User = await this.repo.save(data)
    return user
  }

  getAll(query: LimitOffsetDto) {
    return this.repo
      .createQueryBuilder("user")
      .select(["user.id", "user.login"])
      .addOrderBy("user.login", "ASC")
      .take(query.limit)
      .skip(query.offset)
      .getMany()
  }

  get(id: number): Promise<User> {
    return this.repo
      .createQueryBuilder("user")
      .select(["user.id", "user.login"])
      .where({ id })
      .getOneOrFail()
  }

  async update(
    id: number,
    data: UpdateUserDto
  ): Promise<Omit<User, "password">> {
    const user = await this.repo.findOneBy({ id })
    if (!user) {
      throw new Error("User not found")
    }

    if (data.login) {
      const isLogin = await this.validateLogin(data.login)
      if (isLogin && user.login !== data.login)
        throw new Error("User with this login already exists")
    }

    const { password, ...updatedUser } = await this.repo.save<User>({
      ...user,
      ...data
    })
    return updatedUser
  }

  async updatePassword(id: number, data: UpdatePasswordDto): Promise<boolean> {
    const user = await this.repo.findOneBy({ id })
    if (!user) {
      throw new Error("User not found")
    }

    user.password = await this.generateHashPassword(data.password)
    return !!(await this.repo.save(user))
  }

  delete(id: number): Promise<DeleteResult> {
    return this.repo.delete(id)
  }

  async validateLogin(login: string): Promise<boolean> {
    return !!(await this.repo
      .createQueryBuilder("user")
      .select("user.login")
      .where("user.login ILIKE :login", { login: login }) // ILIKE - регистронезависимый поиск
      .getOne())
  }

  private generateHashPassword(
    password: string,
    saltOrRounds = 10
  ): Promise<string> {
    return bcrypt.hash(password, saltOrRounds)
  }

  private generateTokenData(user: User): TokensGeneratedData {
    return {
      payload: { sub: user.id, id: user.id, roles: user.roles },
      accessTokenExpiresIn: accessTokenExpiresInTime,
      refreshTokenExpiresIn: adminRefreshTokenExpiresIn
    }
  }
}
