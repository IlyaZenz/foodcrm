import { CanMatchFn, Router, Routes } from '@angular/router'
import { adminRoutes } from './admin.routes'
import { inject } from '@angular/core'
import { AuthService } from '../auth/auth.service'
import { map, tap } from 'rxjs'

const isLoggedIn: CanMatchFn = () => {
  const router = inject(Router)
  return inject(AuthService).isAuth$.pipe(
    tap((isAuth) => {
      if (!isAuth) router.navigate(['/login']).then()
    })
  )
}

const isNotLoggedIn: CanMatchFn = () => {
  const router = inject(Router)
  return inject(AuthService).isAuth$.pipe(
    tap((isAuth) => {
      if (isAuth) router.navigate(['/']).then()
    }),
    map((isAuth) => !isAuth)
  )
}

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('../../layouts/pages/login-page.component'),
    canMatch: [isNotLoggedIn]
  },
  {
    path: '',
    children: adminRoutes,
    canMatch: [isLoggedIn]
  },
  {
    path: '**',
    redirectTo: ''
  }
]
