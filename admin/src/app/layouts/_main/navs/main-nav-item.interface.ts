import { Role } from '../../../core/auth/rolls.enum'

export interface MainNavItem {
  title: string
  icon: string
  url: string
  accessRole?: Role
}
