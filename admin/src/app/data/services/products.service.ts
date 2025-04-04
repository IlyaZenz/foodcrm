import { inject, Injectable } from '@angular/core'
import { BehaviorSubject, catchError, EMPTY, filter, first, Observable, of, tap } from 'rxjs'
import { Category } from '../interfaces/category.interface'
import { HttpClient, HttpParams } from '@angular/common/http'
import { Router } from '@angular/router'
import { MatSnackBar } from '@angular/material/snack-bar'
import { DrawerService } from '../../layouts/_main/drawer/drawer.service'
import { Product } from '../interfaces/product.interface'
import { ProductVariant } from '../interfaces/product-variant.interface'

@Injectable()
export class ProductService {
  private _items$ = new BehaviorSubject<Product[]>([])
  private _item$ = new BehaviorSubject<Product | null>(null)
  private _canLoadItems$ = new BehaviorSubject<boolean>(true)
  private offset: number = 0

  private http = inject(HttpClient)
  private router = inject(Router)
  private snackBar = inject(MatSnackBar)
  private drawer = inject(DrawerService)

  item$(): Observable<Product> {
    return this._item$.pipe(filter((product): product is Product => !!product))
  }

  items$(): Observable<Product[]> {
    return this._items$.asObservable()
  }

  item(): Product | null {
    return this._item$.getValue()
  }

  canLoadItems$(): Observable<boolean> {
    return this._canLoadItems$.asObservable()
  }

  downloadItems(limit: number,currentCategory:string): void {
    if (!this._canLoadItems$.getValue()) return

    this._canLoadItems$.next(false)
    const params = new HttpParams().appendAll({ category: currentCategory,limit, offset: this.offset});

    this.http
      .get<Product[]>(`api/products?${params}`)
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
      .get<Product>(`api/products/${url}`)
      .pipe(
        tap({
          next: (product) =>
            this._item$.next({
              ...product,
              url,
            })
        }),
        catchError(() => {
          this.router.navigateByUrl('api/products').then()
          return EMPTY
        }),
        first()
      )
      .subscribe()
  }

  add(product: { title: string,}) {
    this.http
      .post<Product>('api/products', product)
      .pipe(
        tap({
          next: (value) => {
            const product = this._items$.getValue()
            product.push(value)
            product.sort((a, b) => a.title.localeCompare(b.title))
            this._items$.next(product)
            this.drawer.close()
            this.router.navigate(['/categories', value.url]).then()
            this.snackBar.open('Товар добавлен')
          },
          error: () => this.snackBar.open('Возникла ошибка')
        }),
        first()
      )
      .subscribe()
  }

  addProductVariant(variant: { title: string, price?:number}): Observable<ProductVariant | boolean> {
    const product: Product | null = this.item()
    if (!product) return of(false)
    return this.http
      .post<ProductVariant>(`api/products/${product.id}`, variant)
      .pipe(
        tap({
          next: (value) => {
            const currentProduct = this._item$.getValue()
            if (currentProduct) {
              currentProduct.variants.push(value);
              this._item$.next(currentProduct);
              this.snackBar.open('Вариант добавлен');
            }
          },
          error: () => this.snackBar.open('Не удалось добавить вариант')
        }),
      )
  }

  update(data: Partial<Product>): Observable<boolean | Product> {
    const product: Product | null = this.item()
    if (!product) return of(false)
    return this.http
      .put<Product>(`api/products/${product.id}`, { ...product, ...data })
      .pipe(
        tap({
          next: (updatedProduct) => {
            this._item$.next({ ...product, ...updatedProduct })
            const items = this._items$
              .getValue()
              .map((i) => (i.id === product.id ? { ...i, ...updatedProduct } : i))
            this._items$.next(items)
            this.snackBar.open('Данные обновлены')
            this.drawer.close()
          },
          error: () => this.snackBar.open('Не удалось обновить данные')
        })
      )
  }

  deleteVariant(id: number, url:string) {
    this.http
      .delete<boolean>(`api/products/variants/${id}`)
      .pipe(
        tap({
          next: () => {
            console.log(url)
            let product: Product[] = this._items$.getValue()
            this._items$.next(product.filter((i) => i.id !== id))
            this.snackBar.open('Вариант удален')
            this.router.navigateByUrl(`categories/products`).then()
          },
          error: (err) => {
            console.error('Ошибка при удалении:', err);
            this.snackBar.open('Не удалось удалить Вариант')}
        }),
        first()
      )
      .subscribe()
  }

  delete(id: number) {
    this.http
      .delete<boolean>(`api/products/${id}`)
      .pipe(
        tap({
          next: () => {
            let product: Product[] = this._items$.getValue()
            this._items$.next(product.filter((i) => i.id !== id))
            this.snackBar.open('Продукт удален')
            this.router.navigateByUrl('/products').then()
          },
          error: (err) => {
            console.error('Ошибка при удалении:', err);
            this.snackBar.open('Не удалось удалить продукт и его вариации')}
        }),
        first()
      )
      .subscribe()
  }
}

