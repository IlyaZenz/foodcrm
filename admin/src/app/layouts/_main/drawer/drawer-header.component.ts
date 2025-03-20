import { Component, inject } from '@angular/core'
import { DrawerService } from './drawer.service'
import { MatIconButton } from '@angular/material/button'
import { MatIcon } from '@angular/material/icon'

@Component({
  selector: 'drawer-header',
  imports: [MatIconButton, MatIcon],
  template: `
    <div class="d-flex justify-content-between align-items-center">
      <div class="mat-title-large">
        <ng-content select="title"></ng-content>
      </div>
      <button mat-icon-button (click)="closeDrawer()">
        <mat-icon>close</mat-icon>
      </button>
    </div>
  `
})
export class DrawerHeaderComponent {
  private drawer = inject(DrawerService)

  closeDrawer() {
    this.drawer.close()
  }
}
