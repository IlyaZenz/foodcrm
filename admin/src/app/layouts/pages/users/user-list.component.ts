import {Component, inject, Injector} from '@angular/core'
import { ListDetailLayoutComponent } from '../../_main/template/list-detail-layout.component'
import {
  MatListItem,
  MatListItemTitle,
  MatNavList
} from '@angular/material/list'
import { RouterLink, RouterLinkActive } from '@angular/router'
import { TopBar } from '../../_main/navs/top-bar.component'
import { MatIcon } from '@angular/material/icon'
import { MatIconButton } from '@angular/material/button'
import { UsersService } from '../../../data/services/users.service'
import { Observable } from 'rxjs'
import { UserPreview } from '../../../data/interfaces/user.interface'
import { AsyncPipe } from '@angular/common'
import { InfinityScrollComponent } from '../../elements/infinity-scroll.component'
import {DrawerService} from '../../_main/drawer/drawer.service';
import {UserAddDrawerComponent} from '../../drawers/user-add-drawer.component';

@Component({
  providers: [UsersService],
  imports: [
    ListDetailLayoutComponent,
    MatNavList,
    MatListItem,
    RouterLinkActive,
    RouterLink,
    MatListItemTitle,
    TopBar,
    MatIcon,
    MatIconButton,
    AsyncPipe,
    InfinityScrollComponent
  ],
  template: `
    <list-detail-layout isSmallWidth>
      <ng-container ngProjectAs="firstPane">
        <top-bar menuButton>
          <ng-container ngProjectAs="title">Сотрудники</ng-container>
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
                <div matListItemTitle>{{ item.login }}</div>
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
export default class UsersAddComponent {
  limit: number = 50

  private injector = inject(Injector)
  private drawer = inject(DrawerService)
  private service = inject(UsersService)
  data$: Observable<UserPreview[]> = this.service.items$()
  canLoad$: Observable<boolean> = this.service.canLoadItems$()

  load() {
    this.service.downloadItems(this.limit)
  }

  add(){
    this.drawer.openDrawer(UserAddDrawerComponent,{
      mode:"over",
      position:"end",
      largeMode:true,
      closeOnNavigation:true,
      injector: this.injector
    })
  }
}
