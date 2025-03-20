import { inject, Injectable } from '@angular/core'
import { MatIconRegistry } from '@angular/material/icon'
import { DomSanitizer } from '@angular/platform-browser'

@Injectable({ providedIn: 'root' })
export class CustomMatIconService {
  private _customIcons: { title: string; svgIcon: string }[] = [
    // добавить массив собственных иконок при необходимости
    // ...currencyIcons,
    // ...socialIcons,
  ]
  private _iconRegistry = inject(MatIconRegistry)
  private _sanitizer = inject(DomSanitizer)

  init() {
    this._iconRegistry.setDefaultFontSetClass('material-symbols-outlined')
    this._customIcons.forEach((i: { title: string; svgIcon: string }) =>
      this._iconRegistry.addSvgIconLiteral(
        i.title,
        this._sanitizer.bypassSecurityTrustHtml(i.svgIcon)
      )
    )
  }
}
