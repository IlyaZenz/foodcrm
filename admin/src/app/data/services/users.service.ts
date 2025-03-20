import { inject, Injectable } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { Router } from '@angular/router'
import { AuthService } from '../../core/auth/auth.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { DrawerService } from '../../layouts/_main/drawer/drawer.service'
import {
  BehaviorSubject,
  catchError,
  EMPTY,
  filter,
  first, map,
  Observable,
  of,
  tap
} from 'rxjs'
import { User, UserDirty, UserPreview } from '../interfaces/user.interface'
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms'

@Injectable()
export class UsersService {
  private _items$ = new BehaviorSubject<UserPreview[]>([])
  private _item$ = new BehaviorSubject<UserDirty | null>(null)
  private _canLoadItems$ = new BehaviorSubject<boolean>(true)

  private offset: number = 0

  private http = inject(HttpClient)
  private router = inject(Router)
  private auth = inject(AuthService)
  private snackBar = inject(MatSnackBar)
  private drawer = inject(DrawerService)

  downloadItems(limit: number): void {
    if (!this._canLoadItems$.getValue()) return

    this._canLoadItems$.next(false)
    const params = new HttpParams().appendAll({ limit, offset: this.offset })

    this.http
      .get<UserPreview[]>(`api/users?${params}`)
      .pipe(
        tap((data) => {
          // TODO add comment
          const storeData = new Map(
            this._items$.getValue().map((item) => [item.id, item])
          )

          data.forEach((item) =>
            storeData.set(item.id, { ...storeData.get(item.id), ...item })
          )

          this._items$.next(
            Array.from(storeData.values()).sort((a, b) =>
              a.login.localeCompare(b.login)
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
      .get<UserDirty>(`api/users/${id}`)
      .pipe(
        tap({
          next: (user) =>
            this._item$.next({
              ...user,
              id,
              isMyProfile: this.auth.getUserIdFromToken() === id
            })
        }),
        catchError(() => {
          this.router.navigateByUrl('/users').then()
          return EMPTY
        }),
        first()
      )
      .subscribe()
  }

  items$(): Observable<UserPreview[]> {
    return this._items$.asObservable()
  }

  item$(): Observable<UserDirty> {
    return this._item$.pipe(filter((user): user is UserDirty => !!user))
  }

  item(): UserDirty | null {
    return this._item$.getValue()
  }

  canLoadItems$(): Observable<boolean> {
    return this._canLoadItems$.asObservable()
  }

  hasLogin(login: { login: string }): Observable<boolean> {
    return this.http.post<boolean>('api/users/has-login', { login })
  }

  checkExistingUsername():AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.hasLogin(control.value).pipe(
        map((exists) =>
          exists ? { isExist: { value: control.value } } : null,
        ),
        catchError(() => of(null)),
        first(),
      )
    }
  }

  add(user: { login: string; password: string }) {
    this.http
      .post<UserPreview>('api/users', user)
      .pipe(
        tap({
          next: (value) => {
            const users = this._items$.getValue()
            users.push(value)
            users.sort((a, b) => a.login.localeCompare(b.login))
            this._items$.next(users)
            this.drawer.close()
            this.router.navigate(['/users', value.id]).then()
            this.snackBar.open('Сотрудник добавлен')
          },
          error: () => this.snackBar.open('Возникла ошибка')
        }),
        first()
      )
      .subscribe()
  }

  update(data: Partial<User>): Observable<boolean | User> {
    const user: UserDirty | null = this.item()
    if (!user) return of(false)
    return this.http
      .put<User>(`api/users/${user.id}`, { ...user, ...data })
      .pipe(
        tap({
          next: (updatedUser) => {
            this._item$.next({ ...user, ...updatedUser })
            const items = this._items$
              .getValue()
              .map((i) => (i.id === user.id ? { ...i, ...updatedUser } : i))
            this._items$.next(items)
            this.snackBar.open('Данные обновлены')
            this.drawer.close()
          },
          error: () => this.snackBar.open('Не удалось обновить данные')
        })
      )
  }

  updatePassword(id: number, password: string) {
    this.http.put<boolean>(`api/users/${id}/password`, { password }).subscribe({
      next: () => {
        this.snackBar.open('Пароль обновлен')
        this.drawer.close()
      },
      error: () => {
        this.snackBar.open('Не удалось обновить пароль')
      }
    })
  }

  delete(id: number) {
    this.http
      .delete<boolean>(`api/users/${id}`)
      .pipe(
        tap({
          next: () => {
            let users: UserPreview[] = this._items$.getValue()
            this._items$.next(users.filter((i) => i.id !== id))
            this.snackBar.open('Сотрудник удален')
            this.router.navigateByUrl('/users').then()
          },
          error: () => this.snackBar.open('Не удалось удалить сотрудника')
        }),
        first()
      )
      .subscribe()
  }
}
