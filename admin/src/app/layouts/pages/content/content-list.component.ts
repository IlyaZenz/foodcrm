import { Component, inject } from '@angular/core'
import { ListDetailLayoutComponent } from '../../_main/template/list-detail-layout.component'
import { MatIcon } from '@angular/material/icon'
import { MatIconButton } from '@angular/material/button'
import { TopBar } from '../../_main/navs/top-bar.component'
import { AsyncPipe } from '@angular/common'
import { InfinityScrollComponent } from '../../elements/infinity-scroll.component'
import { MatListItem, MatListItemTitle, MatNavList } from '@angular/material/list'
import { RouterLink, RouterLinkActive } from '@angular/router'
import { UsersService } from '../../../data/services/users.service'
import { BannerService } from '../../../data/services/banners.service'
import { Observable } from 'rxjs'

@Component({
  providers: [BannerService],
  imports: [
    ListDetailLayoutComponent,
    TopBar,
    MatListItem,
    MatListItemTitle,
    MatNavList,
    RouterLink
  ],
  template: `
    <list-detail-layout isSmallWidth>
      <ng-container ngProjectAs="firstPane">
        <top-bar menuButton>
          <ng-container ngProjectAs="title">Контент</ng-container>
        </top-bar>
        <div>
          <mat-nav-list>
            <a
              mat-list-item
              routerLink="/content/banners">
              <div matListItemTitle>Баннеры</div>
            </a>
          </mat-nav-list>
        </div>
      </ng-container>
    </list-detail-layout>
  `
})
export default class ContentListComponent {

}
