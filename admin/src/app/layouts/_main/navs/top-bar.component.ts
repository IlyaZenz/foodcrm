import {
  booleanAttribute,
  Component,
  HostBinding,
  inject,
  Input,
  OnInit
} from '@angular/core'
import { QueryParamsHandling, RouterLink } from '@angular/router'
import { MainNavItem } from './main-nav-item.interface'
import { BreakpointsService } from '../../../core/breakpoints.service'
import { StoreService } from '../../../core/handlers/stores/store.service'
import { DomSanitizer, SafeStyle } from '@angular/platform-browser'
import { StoreEnum } from '../../../data/enums/store.enum'
import { first, Observable } from 'rxjs'
import { MatToolbar } from '@angular/material/toolbar'
import { AsyncPipe } from '@angular/common'
import { MatIconButton } from '@angular/material/button'
import { MatIcon } from '@angular/material/icon'
import { DrawerService } from '../drawer/drawer.service'
import { MainDrawerComponent } from '../main-drawers/main-menu-drawer.component'

@Component({
  selector: 'top-bar',
  imports: [MatToolbar, AsyncPipe, MatIconButton, MatIcon, RouterLink],
  template: `
    <mat-toolbar class="d-flex justify-content-between">
      @if (
        backUrl || ((isCompact$ | async) && (menuButton || backUrlOnCompact))
      ) {
        <div>
          @if (isCompact$ | async) {
            @if (menuButton) {
              <button mat-icon-button (click)="openMobile()">
                <mat-icon>menu</mat-icon>
              </button>
            } @else if (backUrlOnCompact) {
              <button
                mat-icon-button
                [queryParamsHandling]="queryParamsHandling"
                [routerLink]="backUrlOnCompact">
                <mat-icon>arrow_back</mat-icon>
              </button>
            }
            @if (backUrl) {
              <button
                mat-icon-button
                [queryParamsHandling]="queryParamsHandling"
                [routerLink]="backUrlOnCompact">
                <mat-icon>arrow_back</mat-icon>
              </button>
            }
          }
        </div>
      }
      <div class="mat-title-large">
        <ng-content select="title"></ng-content>
      </div>
      <div>
        <ng-content></ng-content>
      </div>
    </mat-toolbar>
  `
})
export class TopBar implements OnInit {
  @Input({ transform: booleanAttribute }) menuButton?: boolean
  @Input() backUrl?: string
  @Input() backUrlOnCompact?: string
  @Input() queryParamsHandling?: QueryParamsHandling | null
  @Input({ transform: booleanAttribute }) sticky?: boolean

  private mainNav: MainNavItem[] = []
  private drawer = inject(DrawerService)
  private store = inject(StoreService)
  private sanitizer = inject(DomSanitizer)

  private breakpoints = inject(BreakpointsService)
  isCompact$: Observable<boolean> = this.breakpoints.isCompact$()

  @HostBinding('style')
  get style(): SafeStyle {
    return this.sticky
      ? this.sanitizer.bypassSecurityTrustStyle(
          `position: sticky; top:0; z-index:10;`
        )
      : {}
  }

  ngOnInit() {
    this.store
      .get<MainNavItem[]>(StoreEnum.mainNav)
      .pipe(first())
      .subscribe((data) => (this.mainNav = data))
  }

  openMobile() {
    this.drawer.openDrawer(MainDrawerComponent, {
      closeOnNavigation: true,
      cmpData: this.mainNav
    })
  }
}
