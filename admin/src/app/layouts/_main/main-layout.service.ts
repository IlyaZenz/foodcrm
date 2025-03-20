import { inject, Injectable } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { BreakpointsService } from '../../core/breakpoints.service'
import { combineLatest, map, Observable, of, startWith, switchMap } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class MainLayoutService {
  private router = inject(Router)
  private breakpoints = inject(BreakpointsService)

  isChildRouteOn$(route: ActivatedRoute): Observable<boolean> {
    return this.router.events.pipe(
      startWith(''),
      switchMap(() => of(route.children.length > 0))
    )
  }

  isChildRouteOnAddMobile$(route: ActivatedRoute): Observable<boolean> {
    return combineLatest([
      this.isChildRouteOn$(route),
      this.breakpoints.isMobile$()
    ]).pipe(
      map(
        ([isChildRouteActivated, isMobile]) => isChildRouteActivated && isMobile
      )
    )
  }
}
