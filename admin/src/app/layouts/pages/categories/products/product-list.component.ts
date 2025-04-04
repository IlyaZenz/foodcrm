import { Component, inject, Injector, Input, numberAttribute } from '@angular/core'
import { AsyncPipe } from '@angular/common'
import { InfinityScrollComponent } from '../../../elements/infinity-scroll.component'
import { ListDetailLayoutComponent } from '../../../_main/template/list-detail-layout.component'
import { MatIcon } from '@angular/material/icon'
import { MatIconButton } from '@angular/material/button'
import { MatListItem, MatListItemTitle, MatNavList } from '@angular/material/list'
import { RouterLink, RouterLinkActive } from '@angular/router'
import { TopBar } from '../../../_main/navs/top-bar.component'
import { DrawerService } from '../../../_main/drawer/drawer.service'
import { Observable } from 'rxjs'
import { Category } from '../../../../data/interfaces/category.interface'
import { ProductService } from '../../../../data/services/products.service'
import CategoryItemComponent from '../category-item.component'
import { CategoryAddDrawerComponent } from '../../../drawers/category-add-drawer.component'
import { ProductAddDrawerComponent } from '../../../drawers/product-add-drawer.component'

@Component({
  providers: [ProductService],
  imports: [
    AsyncPipe,
    InfinityScrollComponent,
    ListDetailLayoutComponent,
    MatIcon,
    MatIconButton,
    MatListItem,
    MatListItemTitle,
    MatNavList,
    RouterLinkActive,
    TopBar,
    RouterLink,
  ],
  template: `
    <list-detail-layout isSmallWidth>
      <ng-container ngProjectAs="firstPane">
        <top-bar menuButton>
          <ng-container ngProjectAs="title">Товары</ng-container>
          <button mat-icon-button (click)="add()">
            <mat-icon>add</mat-icon>
          </button>
        </top-bar>
        <div>
          @if (canLoad$ | async) {
            <infinity-scroll (scrolled)="load()"></infinity-scroll>
          }
          <mat-nav-list>
            @for (item of data$ | async; track item) {
              <a
                mat-list-item
                routerLinkActive="mdc-list-item--activated"
                [routerLink]="[item.url]">
                <div matListItemTitle>{{ item.title }}</div>
              </a>
            } @empty {
              <mat-list-item>Нет данных</mat-list-item>
            }
          </mat-nav-list>
        </div>
      </ng-container>
    </list-detail-layout>
  `
})
export default class ProductListComponent {
  limit: number = 50
  url: string = ''

  private injector = inject(Injector)
  private drawer = inject(DrawerService)
  private service = inject(ProductService)
  data$: Observable<Category[]> = this.service.items$()
  canLoad$: Observable<boolean> = this.service.canLoadItems$()

  @Input({ alias: 'categoryUrl' })
  set _url(url: string) {
    this.url = url
  }

  add() {
    this.drawer.openDrawer(ProductAddDrawerComponent, {
      mode: 'over',
      position: 'end',
      largeMode: true,
      closeOnNavigation: true,
      injector: this.injector
    })
  }

  load() {
    this.service.downloadItems(this.limit, this.url)
  }
}
