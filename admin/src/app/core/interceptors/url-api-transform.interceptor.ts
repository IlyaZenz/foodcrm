import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from '../../../environments/environment'

export function urlApiTransformInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<any>> {
  // console.log('url handle');

  if (!environment.directUrl) {
    console.error('Отсутствует directUrl, запрос не может быть преобразован')
    return next(req)
  }

  // Не обрабатывать прямые запросы
  if (req.url.startsWith('https') || req.url.startsWith('http')) {
    return next(req)
  }

  // Здесь находится ссылка на прямой адрес сайта, это необходимо для
  // корректного выполнения запросов
  let url = JSON.parse(JSON.stringify(environment.directUrl))
  url = url.toLowerCase()

  // Если это не ссылка, то обработка url не выполняется
  if (!url.startsWith('https') && !url.startsWith('http')) {
    console.error(
      'directUrl не содержит гиперссылки, запрос не может быть преобразован',
    )
    return next(req)
  }

  // Если в конце отсутствует слэш, нужно добавить
  if (!url.endsWith('/')) {
    url += '/'
  }

  // Обрабатывать только запросы api
  if (req.url.indexOf('api') !== 0 && req.url.indexOf('/api') !== 0) {
    return next(req)
  }

  url += req.url.startsWith('/') ? req.url.slice(1) : req.url

  console.log('Отладка: измененный url: ', url);

  return next(req.clone({ url }))
}
