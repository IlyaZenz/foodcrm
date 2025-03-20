import { Component, Input } from '@angular/core'
import { DrawerHeaderComponent } from '../drawer/drawer-header.component'
import { MainNavItem } from '../navs/main-nav-item.interface'
import {
  MatListItem,
  MatListItemIcon,
  MatListItemTitle,
  MatNavList
} from '@angular/material/list'
import { RouterLink, RouterLinkActive } from '@angular/router'
import { MatIcon } from '@angular/material/icon'

@Component({
  imports: [
    DrawerHeaderComponent,
    MatNavList,
    MatListItem,
    RouterLink,
    RouterLinkActive,
    MatIcon,
    MatListItemIcon,
    MatListItemTitle
  ],
  template: `
    <drawer-header></drawer-header>
    <mat-nav-list>
      @for (link of data; track link) {
        <a
          mat-list-item
          routerLinkActive="mdc-list-item--activated"
          [routerLink]="link.url"
          [routerLinkActiveOptions]="{ exact: link.url === '/' }">
          <mat-icon matListItemIcon>{{ link.icon }}</mat-icon>
          <div matListItemTitle>{{ link.title }}</div>
        </a>
      }
    </mat-nav-list>
  `
})
export class MainDrawerComponent {
  @Input() data: MainNavItem[] = []
}
