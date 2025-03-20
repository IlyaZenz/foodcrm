import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core'
import { AuthService } from '../../core/auth/auth.service'
import { BreakpointsService } from '../../core/breakpoints.service'
import { Observable } from 'rxjs'
import { AsyncPipe, NgClass } from '@angular/common'
import {
  MatSidenav,
  MatSidenavContainer,
  MatSidenavContent
} from '@angular/material/sidenav'
import { RouterOutlet } from '@angular/router'
import { RailComponent } from './navs/rail.component'
import { mainNav } from '../../data/main-nav'
import { MainNavItem } from './navs/main-nav-item.interface'
import { StoreService } from '../../core/handlers/stores/store.service'
import { StoreEnum } from '../../data/enums/store.enum'
import { DrawerService } from './drawer/drawer.service'

@Component({
  standalone: true,
  styles: `
    @use '@angular/material' as mat;
    @use '../../../styles/md-theme.scss' as theme;

    .layout-wrapper {
      display: flex;
      min-height: 100vh;

      @supports (min-height: 100dvh) {
        min-height: 100dvh;
      }

      .sidenav-wrapper {
        display: flex;
        position: relative;
        max-width: 100%;
        width: 100%;

        .sidenav-container {
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          position: absolute;
          width: 100%;
          max-width: 100%;

          mat-sidenav {
            box-sizing: border-box;
            padding: 24px;
            width: 360px;
            overflow-x: hidden;
            background-color: mat.get-theme-color(
              theme.$m3-light-theme,
              neutral,
              96
            );

            &.drawer-large-mode {
              width: 760px;
              @media (max-width: 599px) {
                width: calc(100% - 1em);
              }
              @media (min-width: 600px) and (max-width: 839px) {
                width: calc(100% - 88px - 1em);
              }
            }
          }

          .content-wrapper {
            height: 100%;
            box-sizing: border-box;
            padding: 8px;
          }
        }
      }
    }
  `,
  imports: [
    AsyncPipe,
    MatSidenavContainer,
    RouterOutlet,
    MatSidenavContent,
    MatSidenav,
    NgClass,
    RailComponent
  ],
  template: `
    <div class="layout-wrapper">
      <!--navigation-rail for tablet+ devices-->
      @if (
        (isExtraLarge$() | async) ||
        (isLarge$() | async) ||
        (isExpanded$() | async) ||
        (isMedium$() | async)
      ) {
        <rail-nav [items]="mainNav"></rail-nav>
      }
      <div class="sidenav-wrapper">
        <mat-sidenav-container class="sidenav-container">
          <!--navigation mobile menu and content drawer for larger screen-->
          <mat-sidenav
            #sidenav
            fixedInViewport
            [autoFocus]="false"
            [ngClass]="{ 'drawer-large-mode': isDrawerLargeMode() | async }"
            (closedStart)="closeDrawer()">
            <ng-container #drawerContent>
              <!--внутри динамического компонента:-->
              <!--<drawer-header></>drawer-header>-->
              <!--drawer content below-->
            </ng-container>
          </mat-sidenav>
          <mat-sidenav-content>
            <div class="content-wrapper">
              <router-outlet></router-outlet>
            </div>
          </mat-sidenav-content>
        </mat-sidenav-container>
        <!--TODO bottom navigation for smartphones-->
      </div>
    </div>
  `
})
export default class MainLayoutComponent implements OnInit, AfterViewInit {
  mainNav: MainNavItem[] = []

  @ViewChild('sidenav') drawerRef?: MatSidenav
  @ViewChild('drawerContent', { read: ViewContainerRef })
  drawerContent?: ViewContainerRef

  private store = inject(StoreService)
  private auth = inject(AuthService)
  private breakpoints = inject(BreakpointsService)
  private drawer = inject(DrawerService)

  ngOnInit() {
    this.mainNav = this.mainNavPermissionHandle(mainNav)
    this.store.add({ key: StoreEnum.mainNav, data: this.mainNav })
  }

  ngAfterViewInit() {
    this.initDrawer()
  }

  mainNavPermissionHandle(data: MainNavItem[]): MainNavItem[] {
    return data.filter(
      (item) => !item.accessRole || this.auth.canAccess(item.accessRole)
    )
  }

  closeDrawer() {
    this.drawer.close()
  }

  isDrawerLargeMode(): Observable<boolean> {
    return this.drawer.isLargeMode$
  }

  isMedium$(): Observable<boolean> {
    return this.breakpoints.isMedium$()
  }

  isExpanded$(): Observable<boolean> {
    return this.breakpoints.isExpanded$()
  }

  isLarge$(): Observable<boolean> {
    return this.breakpoints.isLarge$()
  }

  isExtraLarge$(): Observable<boolean> {
    return this.breakpoints.isExtraLarge$()
  }

  /*
   * Для манипуляции с drawer нужно зарегистрировать его в сервисе.
   * Это делается в методе ngAfterViewInit (в onInit drawer не существует)
   * метод выдаст сообщение для отладки если drawer не будет найден
   * */
  private initDrawer() {
    this.drawerRef && this.drawerContent
      ? this.drawer.setDrawerAndDrawerContentRef(
          this.drawerRef,
          this.drawerContent
        )
      : console.log('no drawer')
  }
}
