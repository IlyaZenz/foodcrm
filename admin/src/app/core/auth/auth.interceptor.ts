import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http'
import { catchError, Observable, switchMap, throwError } from 'rxjs'
import { inject } from '@angular/core'
import { AuthService } from './auth.service'

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  const auth = inject(AuthService)
  const url = req.url

  /*
  * Алгоритм общий (Актуальный):
  *
  * Сначала проверим исключение, если запрос на обновления токена (апи рефреш) то отдадим управление сервису заголовок
  * с токеном добавляется в сервисе.
  * Другие запросы будет перехватывать если юзер авторизирован(у него есть токен и токен не истек то мы добавим этот токен
  * в заголовок иначе отправим оригинальный запрос без токена).
  * Обработаем ответ. Если код ошибки 401(ошибка авторизации) проверим актуальность refreshToken, если он актуален
  * обновим токены и повторим запрос с обновленным accessToken
  * */

  // Если запрошено обновление токена, ничего не делаем
  // Заголовок добавляется в сервисе
  if (url === 'api/auth/refresh') {
    return next(req)
  }

  // Другие запросы могут быть - аутентифицированные и не аутентифицирован ные запросы
  // Для аутентифицированных запросов необходимо добавить accessToken к заголовку

  // Использование подписки на поток проверки является ли пользователь авторизированным вызывает ошибку при
  // выполнении async pipe. Изменено на проверку токена в Local Store, там же выполняется проверка времени жизни токена.

  const accessToken = auth.getNonExpiredAccessToken()
  const handledReq = accessToken
    ? next(
        req.clone({
          headers: req.headers.set('Authorization', `Bearer ${accessToken}`),
        }),
      )
    : next(req)

  return handledReq.pipe(
    catchError((error: HttpErrorResponse): Observable<HttpEvent<unknown>> => {
      const refreshToken = auth.getNonExpiredRefreshToken()
      if (error.status === 401 && refreshToken) {
        return auth.refreshTokens(refreshToken).pipe(
          switchMap((tokens) =>
            next(
              req.clone({
                setHeaders: {
                  Authorization: `Bearer ${tokens.accessToken}`,
                },
              }),
            ),
          ),
        )
      }
      return throwError(() => error)
    }),
  )
}
