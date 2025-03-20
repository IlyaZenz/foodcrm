import { CanActivate, ExecutionContext, mixin, Type } from "@nestjs/common"
import { User } from "./user.entity"
import { Role } from "./roles.enum"

interface RequestWithUser extends Request {
  user: User // Ваша сущность пользователя
}

// Объявление типа для ролей, которые могут быть как одиночными, так и массивом
type RoleOrRoles = Role | Role[]

export const RolesGuard = (roles: RoleOrRoles): Type<CanActivate> => {
  class RolesGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest<RequestWithUser>()
      const userRoles = request.user?.roles // Роли пользователя

      if (!userRoles) return false

      // Приводим roles к массиву
      const requiredRoles = Array.isArray(roles) ? roles : [roles]
      // Проверяем наличие роли
      return requiredRoles.some((role) => userRoles.includes(role))
    }
  }

  return mixin(RolesGuardMixin)
}
