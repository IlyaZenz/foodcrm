import {inject, Injectable, PLATFORM_ID} from '@angular/core'
import {HttpClient, HttpHeaders} from '@angular/common/http'
import {
  BehaviorSubject,
  catchError,
  first,
  map,
  Observable,
  of,
  switchMap, tap
} from 'rxjs'
import {MatSnackBar} from '@angular/material/snack-bar'
import {Router} from '@angular/router'
import {LocalStoreService} from '../handlers/stores/local-store.service'
import {LocalStorageEnum} from '../../data/enums/local-storage.enum'
import {isPlatformBrowser} from '@angular/common'
import {JwtHelperService} from '@auth0/angular-jwt'
import {Role} from './rolls.enum'

export interface TokenResponseData {
  accessToken: string
  refreshToken: string
}

@Injectable({providedIn: 'root'})
export class AuthService {
  // изменение состояние аутентификации, вызывается при ручном изменении токенов (удаление, установка)
  private isAuthStateChanged = new BehaviorSubject<null>(null)
  // Текущее состояние аутентификации,
  // срабатывает при ручном обновлении состояния аутентификации, а также при подписке на isAuth$.
  // Через pipe вызывается checkAuthAndTryUpdatedToken() - проверка аутентификации с попыткой обновления токенов
  isAuth$: Observable<boolean> = this.isAuthStateChanged
    .asObservable()
    .pipe(switchMap(() => this.checkAuthAndTryUpdatedToken()))

  private router = inject(Router)
  private http = inject(HttpClient)
  private snackBar = inject(MatSnackBar)
  private ls = inject(LocalStoreService)
  private platformId = inject(PLATFORM_ID)
  private jwtHelper = inject(JwtHelperService)

  login(data: { login: string; password: string }): Observable<boolean> {
    return this.http.post<TokenResponseData>('api/auth/login', data).pipe(
      switchMap((tokens) => {
        this.ls.setItem(LocalStorageEnum.accessToken, tokens.accessToken)
        this.ls.setItem(LocalStorageEnum.refreshToken, tokens.refreshToken)
        this.isAuthStateChanged.next(null)
        this.router.navigate(['/']).then()
        return of(true)
      }),
      catchError(() => {
        this.snackBar.open('Неправильный логин или пароль')
        return of(false)
      })
    )
  }

  logOut() {
    this.ls.removeItem(LocalStorageEnum.accessToken)
    this.ls.removeItem(LocalStorageEnum.refreshToken)
    this.router.navigate(['api/auth/login'])
  }

  canAccess(roleOrRoles: Role | Role[]): boolean {
    const roles: Role[] = this.getUserRolesFromToken()
    if (!Array.isArray(roleOrRoles)) {
      roleOrRoles = [roleOrRoles]
    }
    return roles.some((role) => roleOrRoles.includes(role))
  }

  getUserRolesFromToken(): Role[] {
    const token: string | null =
      (this.ls.getItem(LocalStorageEnum.accessToken) as string) ?? null
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      const payload = this.jwtHelper.decodeToken(token)
      return payload ? payload.roles : []
    }
    return []
  }

  getUserIdFromToken(): number | null {
    const token = this.getNonExpiredAccessToken()
    if (token) {
      const payload = this.jwtHelper.decodeToken(token)
      return payload ? payload.sub : null
    }
    return null
  }

  private checkAuthAndTryUpdatedToken(): Observable<boolean> {
    // если не браузер вернуть false для избежания ошибок SSR
    if (!isPlatformBrowser(this.platformId)) return of(false)

    //если local store есть действительный accessToken - считать пользователя авторизованным
    const accessToken: string | null =
      (this.ls.getItem(LocalStorageEnum.accessToken) as string) ?? null

    if (!!accessToken) {
      if (!this.jwtHelper.isTokenExpired(accessToken)) return of(true)
      // Удаляем истекший токен
      this.ls.removeItem(LocalStorageEnum.accessToken)
    }

    //Если не удалось аутентифицировать accessToken, то
    //проверить наличие refreshToken, его действительность,
    //попытаться получить новую пару токенов

    const refreshToken: string | null =
      (this.ls.getItem(LocalStorageEnum.refreshToken) as string) ?? null
    if (!!refreshToken) {
      if (!this.jwtHelper.isTokenExpired(refreshToken)) {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${refreshToken}`
        })
        return this.http
          .get<TokenResponseData>('api/auth/refresh', {headers})
          .pipe(
            map((tokens) => {
              if (
                tokens.accessToken &&
                tokens.refreshToken &&
                !this.jwtHelper.isTokenExpired(tokens.accessToken) &&
                !this.jwtHelper.isTokenExpired(tokens.refreshToken)
              ) {
                this.ls.setItem(
                  LocalStorageEnum.accessToken,
                  tokens.accessToken
                )
                this.ls.setItem(
                  LocalStorageEnum.refreshToken,
                  tokens.refreshToken
                )
                return true
              }
              return false
            }),
            catchError(() => of(false)),
            first()
          )
      }
      // Удаляем истекший токен
      this.ls.removeItem(LocalStorageEnum.refreshToken)
    }

    return of(false)
  }

  refreshTokens(refreshToken: string): Observable<TokenResponseData> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${refreshToken}`
    })
    return this.http.get<TokenResponseData>('api/auth/refresh', {headers}).pipe(
      tap({
        next: (tokens: TokenResponseData) => {
          if (
            tokens.accessToken &&
            tokens.refreshToken &&
            !this.jwtHelper.isTokenExpired(tokens.accessToken) &&
            !this.jwtHelper.isTokenExpired(tokens.refreshToken)
          ) {
            this.ls.setItem(LocalStorageEnum.accessToken, tokens.accessToken)
            this.ls.setItem(LocalStorageEnum.refreshToken, tokens.refreshToken)
          }
        },
      }),
    )
  }

  getNonExpiredAccessToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null
    // Вернуть accessToken если он есть и не истек
    const accessToken = (this.ls.getItem(LocalStorageEnum.accessToken) as string) ?? null
    if (!!accessToken && !this.jwtHelper.isTokenExpired(accessToken))
      return accessToken
    return null // Иначе вернуть null
  }

  getNonExpiredRefreshToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null
    // Вернуть refreshToken если он есть и не истек
    const refreshToken = (this.ls.getItem(LocalStorageEnum.refreshToken) as string) ?? null
    if (!!refreshToken && !this.jwtHelper.isTokenExpired(refreshToken))
      return refreshToken
    return null // Иначе вернуть null
  }
}
