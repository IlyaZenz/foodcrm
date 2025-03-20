import { Request } from "@nestjs/common"
import { User } from "../core/auth-users/user.entity"

export interface AuthenticatedRequest extends Request {
  user: Partial<User>
}
