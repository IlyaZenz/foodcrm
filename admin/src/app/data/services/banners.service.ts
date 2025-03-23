import { inject, Injectable } from '@angular/core'
import { BehaviorSubject, catchError, EMPTY, filter, first, Observable, of, tap } from 'rxjs'
import { Banner } from '../interfaces/banner.interface'
import { HttpClient, HttpParams } from '@angular/common/http'
import { User, UserDirty, UserPreview } from '../interfaces/user.interface'
import { Router } from '@angular/router'
import { AuthService } from '../../core/auth/auth.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { DrawerService } from '../../layouts/_main/drawer/drawer.service'

@Injectable()
export class BannerService {

  private _items$ = new BehaviorSubject<Banner[]>([])
  private _item$ = new BehaviorSubject<Banner | null>(null)
  private _canLoadItems$ = new BehaviorSubject<boolean>(true)
  private offset: number = 0

  private http = inject(HttpClient)
  private router = inject(Router)
  private snackBar = inject(MatSnackBar)
  private drawer = inject(DrawerService)

  item$(): Observable<Banner> {
    return this._item$.pipe(filter((banner): banner is Banner => !!banner))
  }

  items$(): Observable<Banner[]> {
    return this._items$.asObservable()
  }

  item(): Banner | null {
    return this._item$.getValue()
  }

  downloadItems(limit: number): void {
    if (!this._canLoadItems$.getValue()) return

    this._canLoadItems$.next(false)
    const params = new HttpParams().appendAll({ limit, offset: this.offset })

    this.http
      .get<Banner[]>(`api/banners?${params}`)
      .pipe(
        tap((data) => {
          const storeData = new Map(
            this._items$.getValue().map((item) => [item.id, item])
          )

          data.forEach((item) =>
            storeData.set(item.id, { ...storeData.get(item.id), ...item })
          )

          this._items$.next(
            Array.from(storeData.values()).sort((a, b) =>
              a.title.localeCompare(b.title)
            )
          )

          if (data.length >= limit) {
            this.offset += limit
            this._canLoadItems$.next(true)
          }
        }),
        first()
      )
      .subscribe()
  }

  downloadOne(id: number) {
    this.http
      .get<Banner>(`api/banners/${id}`)
      .pipe(
        tap({
          next: (banner) =>
            this._item$.next({
              ...banner,
              id,
            })
        }),
        catchError(() => {
          this.router.navigateByUrl('/content/banners').then()
          return EMPTY
        }),
        first()
      )
      .subscribe()
  }

  add(banner: { title: string; desc: string }) {
    this.http
      .post<Banner>('api/banners', banner)
      .pipe(
        tap({
          next: (value) => {
            const users = this._items$.getValue()
            users.push(value)
            users.sort((a, b) => a.title.localeCompare(b.title))
            this._items$.next(users)
            this.drawer.close()
            this.router.navigate(['content/banners', value.id]).then()
            this.snackBar.open('Баннер добавлен')
            console.log(value.sortOrder)
          },
          error: () => this.snackBar.open('Возникла ошибка')
        }),
        first()
      )
      .subscribe()
  }

  update(data: Partial<Banner>): Observable<boolean | Banner> {
    const banner: Banner | null = this.item()
    if (!banner) return of(false)
    return this.http
      .put<Banner>(`api/banners/${banner.id}`, { ...banner, ...data })
      .pipe(
        tap({
          next: (updatedBanner) => {
            this._item$.next({ ...banner, ...updatedBanner })
            const items = this._items$
              .getValue()
              .map((i) => (i.id === banner.id ? { ...i, ...updatedBanner } : i))
            this._items$.next(items)
            this.snackBar.open('Данные обновлены')
            this.drawer.close()
          },
          error: () => this.snackBar.open('Не удалось обновить данные')
        })
      )
  }

  delete(id: number) {
    this.http
      .delete<boolean>(`api/banners/${id}`)
      .pipe(
        tap({
          next: () => {
            let banners: Banner[] = this._items$.getValue()
            this._items$.next(banners.filter((i) => i.id !== id))
            this.snackBar.open('Баннер удален')
            this.router.navigateByUrl('/content/banners').then()
          },
          error: () => this.snackBar.open('Не удалось удалить баннер')
        }),
        first()
      )
      .subscribe()
  }

  canLoadItems$(): Observable<boolean> {
    return this._canLoadItems$.asObservable()
  }
}
