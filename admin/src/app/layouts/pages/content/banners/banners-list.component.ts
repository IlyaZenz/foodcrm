import { Component, inject, Injector } from '@angular/core'
import { AsyncPipe } from '@angular/common'
import { InfinityScrollComponent } from '../../../elements/infinity-scroll.component'
import { BannerService } from '../../../../data/services/banners.service'
import { Observable } from 'rxjs'
import { ListDetailLayoutComponent } from '../../../_main/template/list-detail-layout.component'
import { MatIcon } from '@angular/material/icon'
import { MatIconButton } from '@angular/material/button'
import { MatListItem, MatListItemTitle, MatNavList } from '@angular/material/list'
import { RouterLink, RouterLinkActive } from '@angular/router'
import { TopBar } from '../../../_main/navs/top-bar.component'
import { DrawerService } from '../../../_main/drawer/drawer.service'
import { UserAddDrawerComponent } from '../../../drawers/user-add-drawer.component'
import { BannerAddDrawerComponent } from '../../../drawers/banner-add-drawer.component'
import { UserPreview } from '../../../../data/interfaces/user.interface'
import { Banner } from '../../../../data/interfaces/banner.interface'

@Component({
  providers: [BannerService],
  imports: [
    AsyncPipe,
    InfinityScrollComponent,
    ListDetailLayoutComponent,
    MatIcon,
    MatIconButton,
    MatNavList,
    TopBar,
    MatListItem,
    RouterLink,
    RouterLinkActive
  ],
  template: `
    <list-detail-layout isSmallWidth>
      <ng-container ngProjectAs="firstPane">
        <top-bar menuButton>
          <ng-container ngProjectAs="title">Баннеры</ng-container>
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
                [routerLink]="[item.id]">
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
export default class BannerListComponent {
  limit: number = 50

  private drawer = inject(DrawerService)
  private service = inject(BannerService)
  private injector = inject(Injector)

  data$: Observable<Banner[]> = this.service.items$()
  canLoad$: Observable<boolean> = this.service.canLoadItems$()

  load() {
    this.service.downloadItems(this.limit)
  }
  add() {
    this.drawer.openDrawer(BannerAddDrawerComponent, {
      mode: 'over',
      position: 'end',
      largeMode: true,
      closeOnNavigation: true,
      injector: this.injector
    })
  }
}
