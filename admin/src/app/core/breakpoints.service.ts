import { inject, Injectable } from '@angular/core'
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout'
import { map, Observable } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class BreakpointsService {
  private _breakpointObserver = inject(BreakpointObserver)

  /*
   * Window class (width)
   *
   * Compact	Width < 600 - Phone in portrait
   * Medium	600 ≤ width < 840 - Tablet in portrait, Foldable in portrait (unfolded)
   * Expanded	840 ≤ width < 1200* - Phone in landscape, Tablet in landscape, Foldable in landscape (unfolded), Desktop
   * Large	1200 ≤ width < 1600	- Desktop
   * Extra-large	1600 ≤ width	Desktop, Ultra-wide
   * */

  isMobile$(): Observable<boolean> {
    return this._isMatch('(max-width: 839px)')
  }

  isNotMobile$(): Observable<boolean> {
    return this._isMatch('(min-width: 840px)')
  }

  // Compact	Width < 600 - Phone in portrait
  isCompact$(): Observable<boolean> {
    return this._isMatch('(max-width: 599px)')
  }

  // Medium	600 ≤ width < 840 - Tablet in portrait, Foldable in portrait (unfolded)
  isMedium$(): Observable<boolean> {
    return this._isMatch('(min-width: 600px) and (max-width: 839px)')
  }

  // Expanded	840 ≤ width < 1200* - Phone in landscape, Tablet in landscape, Foldable in landscape (unfolded), Desktop
  isExpanded$(): Observable<boolean> {
    return this._isMatch('(min-width: 840px) and (max-width: 1199px)')
  }

  // Large	1200 ≤ width < 1600	- Desktop
  isLarge$(): Observable<boolean> {
    return this._isMatch('(min-width: 1200px) and (max-width: 1599px)')
  }

  // Extra-large	1600 ≤ width	Desktop, Ultra-wide
  isExtraLarge$(): Observable<boolean> {
    return this._isMatch('(min-width: 1600px)')
  }

  private _isMatch(param: string[] | string): Observable<boolean> {
    return this._breakpointObserver
      .observe(param)
      .pipe(map((state: BreakpointState) => state.matches))
  }
}
