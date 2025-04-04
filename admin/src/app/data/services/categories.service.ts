import { inject, Injectable } from '@angular/core'
import {
  BehaviorSubject,
  catchError,
  EMPTY,
  filter,
  first,
  Observable,
  of,
  tap
} from 'rxjs'
import { HttpClient, HttpParams } from '@angular/common/http'
import { Router } from '@angular/router'
import { MatSnackBar } from '@angular/material/snack-bar'
import { DrawerService } from '../../layouts/_main/drawer/drawer.service'
import { Category } from '../interfaces/category.interface'
import { Banner } from '../interfaces/banner.interface'

@Injectable()
export class CategoriesService {
  private _items$ = new BehaviorSubject<Category[]>([])
  private _item$ = new BehaviorSubject<Category | null>(null)
  private _canLoadItems$ = new BehaviorSubject<boolean>(true)
  private offset: number = 0

  private http = inject(HttpClient)
  private router = inject(Router)
  private snackBar = inject(MatSnackBar)
  private drawer = inject(DrawerService)

  item$(): Observable<Category> {
    return this._item$.pipe(
      filter((category): category is Category => !!category)
    )
  }

  items$(): Observable<Category[]> {
    return this._items$.asObservable()
  }

  item(): Category | null {
    return this._item$.getValue()
  }

  canLoadItems$(): Observable<boolean> {
    return this._canLoadItems$.asObservable()
  }

  downloadItems(limit: number): void {
    if (!this._canLoadItems$.getValue()) return

    this._canLoadItems$.next(false)
    const params = new HttpParams().appendAll({ limit, offset: this.offset })

    this.http
      .get<Category[]>(`api/categories?${params}`)
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

  downloadOne(url: string) {
    this.http
      .get<Category>(`api/categories/${url}`)
      .pipe(
        tap({
          next: (category) =>
            this._item$.next({
              ...category,
              url
            })
        }),
        catchError(() => {
          this.router.navigateByUrl('api/categories').then()
          return EMPTY
        }),
        first()
      )
      .subscribe()
  }

  add(category: { title: string; titleKz: string }) {
    this.http
      .post<Category>('api/categories', category)
      .pipe(
        tap({
          next: (value) => {
            const categories = this._items$.getValue()
            categories.push(value)
            categories.sort((a, b) => a.title.localeCompare(b.title))
            this._items$.next(categories)
            this.drawer.close()
            this.router.navigate(['/categories', value.id]).then()
            this.snackBar.open('Категория добавлен')
          },
          error: () => this.snackBar.open('Возникла ошибка')
        }),
        first()
      )
      .subscribe()
  }

  update(data: Partial<Category>): Observable<boolean | Category> {
    const category: Category | null = this.item()
    if (!category) return of(false)
    return this.http
      .put<Category>(`api/categories/${category.id}`, { ...category, ...data })
      .pipe(
        tap({
          next: (updatedCategory) => {
            this._item$.next({ ...category, ...updatedCategory })
            const items = this._items$
              .getValue()
              .map((i) => (i.id === category.id ? { ...i, ...updatedCategory } : i))
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
      .delete<boolean>(`api/categories/${id}`)
      .pipe(
        tap({
          next: () => {
            let category: Category[] = this._items$.getValue()
            this._items$.next(category.filter((i) => i.id !== id))
            this.snackBar.open('Категория удалена')
            this.router.navigateByUrl('/categories').then()
          },
          error: () => this.snackBar.open('Не удалось удалить категорию')
        }),
        first()
      )
      .subscribe()
  }
}
