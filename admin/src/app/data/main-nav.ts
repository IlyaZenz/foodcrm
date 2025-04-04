import { MainNavItem } from '../layouts/_main/navs/main-nav-item.interface'
import { Role } from '../core/auth/rolls.enum'

export const mainNav: MainNavItem[] = [
  {
    title: 'Главная',
    url: '/',
    icon: 'home'
  },
  {
    title: 'Сотрудники',
    url: '/users',
    icon: 'group',
    accessRole: Role.admin
  },
  {
    title: 'Профиль',
    url: '/profile',
    icon: 'account_circle'
  },
  {
    title: 'Контент',
    url: '/content',
    icon: 'ad'
  },
  {
    title: 'Категории',
    url: '/categories',
    icon: 'category'
  },
  {
    title: 'Заказы',
    url: '/orders',
    icon: 'orders'
  },
]
