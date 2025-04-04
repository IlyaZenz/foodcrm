import { inject, Injectable } from '@angular/core'
import { BehaviorSubject, filter, first, Observable, tap } from 'rxjs'
import { HttpClient, HttpParams } from '@angular/common/http'
import { Router } from '@angular/router'
import { AuthService } from '../../core/auth/auth.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { DrawerService } from '../../layouts/_main/drawer/drawer.service'
import { Order } from '../interfaces/order.interface'
import { UserDirty, UserPreview } from '../interfaces/user.interface'
import { Category } from '../interfaces/category.interface'

@Injectable()
export class OrdersService {
  private _items$ = new BehaviorSubject<Order[]>([])
  private _item$ = new BehaviorSubject<Order | null>(null)
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
      .get<Order[]>(`api/orders?${params}`)
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
              a.id - b.id
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

  items$(): Observable<Order[]> {
    return this._items$.asObservable()
  }

  item$(): Observable<Order> {
    return this._item$.pipe(filter((order): order is Order => !!order))
  }

  item(): Order | null {
    return this._item$.getValue()
  }

  canLoadItems$(): Observable<boolean> {
    return this._canLoadItems$.asObservable()
  }
}
