import { booleanAttribute, Component, inject, Input } from '@angular/core'
import { ActivatedRoute, RouterOutlet } from '@angular/router'
import { MainLayoutService } from '../main-layout.service'
import { Observable } from 'rxjs'
import { AsyncPipe, NgClass } from '@angular/common'

@Component({
  selector: 'list-detail-layout',
  imports: [AsyncPipe, NgClass, RouterOutlet],
  template: `
    <div class="pane-wrapper">
      <!--не активен дочерний маршрут и не mobile-->
      @if (!(isChildRouteOnAddMobile$ | async)) {
        <div
          class="pane first compact vt-pane-one"
          [ngClass]="{
            'small-with': isSmallWidth,
            'no-background': noBg === 'first' || noBg === 'all'
          }">
          <ng-content select="firstPane"></ng-content>
        </div>
      }
      <!--активен дочерний маршрут-->
      <!--показываем его контент-->
      @if (isChildRouteOn$ | async) {
        <div class="space-divider"></div>
        <div class="pane second vt-pane-two">
          <router-outlet></router-outlet>
        </div>
      }
    </div>
  `
})
export class ListDetailLayoutComponent {
  @Input({ transform: booleanAttribute }) isSmallWidth?: boolean
  @Input() noBg?: 'first' | 'second' | 'all'

  private route = inject(ActivatedRoute)
  private layout = inject(MainLayoutService)

  isChildRouteOnAddMobile$: Observable<boolean> =
    this.layout.isChildRouteOnAddMobile$(this.route)
  isChildRouteOn$: Observable<boolean> = this.layout.isChildRouteOn$(this.route)
}
