import { Role } from '../../core/auth/rolls.enum'

export interface UserPreview {
  id: number
  login: string
}

export interface User extends UserPreview {
  roles: Role[]
}

export interface UserDirty extends User {
  isMyProfile?: boolean
}
