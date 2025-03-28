import { Component, inject, Injector } from '@angular/core'
import { RouterLink, RouterLinkActive } from '@angular/router'
import { TopBar } from '../../_main/navs/top-bar.component'
import { ListDetailLayoutComponent } from '../../_main/template/list-detail-layout.component'
import { MatIcon } from '@angular/material/icon'
import { MatIconButton } from '@angular/material/button'
import { DrawerService } from '../../_main/drawer/drawer.service'
import { Observable } from 'rxjs'
import { CategoryAddDrawerComponent } from '../../drawers/category-add-drawer.component'
import { CategoriesService } from '../../../data/services/categories.service'
import { Category } from '../../../data/interfaces/category.interface'
import { AsyncPipe } from '@angular/common'
import { InfinityScrollComponent } from '../../elements/infinity-scroll.component'
import { MatListItem, MatListItemTitle, MatNavList } from '@angular/material/list'

@Component({
  providers: [CategoriesService],
  imports: [
    TopBar,
    ListDetailLayoutComponent,
    MatIcon,
    MatIconButton,
    AsyncPipe,
    InfinityScrollComponent,
    MatListItem,
    MatListItemTitle,
    MatNavList,
    RouterLinkActive,
    RouterLink
  ],

  template: `
    <list-detail-layout isSmallWidth>
      <ng-container ngProjectAs="firstPane">
        <top-bar menuButton>
          <ng-container ngProjectAs="title">Категории</ng-container>
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
export default class CategoryListComponent {
  limit: number = 50

  private injector = inject(Injector)
  private drawer = inject(DrawerService)
  private service = inject(CategoriesService)
  data$: Observable<Category[]> = this.service.items$()
  canLoad$: Observable<boolean> = this.service.canLoadItems$()

  load() {
    this.service.downloadItems(this.limit)
  }

  add() {
    this.drawer.openDrawer(CategoryAddDrawerComponent, {
      mode: 'over',
      position: 'end',
      largeMode: true,
      closeOnNavigation: true,
      injector: this.injector
    })
  }
}
