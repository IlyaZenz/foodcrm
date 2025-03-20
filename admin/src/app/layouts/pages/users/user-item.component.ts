import { Component, inject, Injector, Input, numberAttribute } from '@angular/core'
import { TopBar } from '../../_main/navs/top-bar.component'
import { MatIcon } from '@angular/material/icon'
import { MatIconButton } from '@angular/material/button'
import { UsersService } from '../../../data/services/users.service'
import { Observable, share } from 'rxjs'
import { UserDirty } from '../../../data/interfaces/user.interface'
import { MatCard, MatCardContent } from '@angular/material/card'
import { AsyncPipe } from '@angular/common'
import { MatDialog } from '@angular/material/dialog'
import { ConfirmDialog, ConfirmDialogComponent } from '../../dialogs/confirm-dialog.component'
import { DrawerService } from '../../_main/drawer/drawer.service'
import { UserPasswordDrawerComponent } from '../../drawers/user-password-drawer.component'
import { UserRolesDrawer } from '../../drawers/user-data-drawer.component'

@Component({
  imports: [TopBar, MatIcon, MatIconButton, MatCard, MatCardContent, AsyncPipe],
  template: `
    @let data = data$|async;
    <top-bar backUrlOnCompact=".." sticky>
      <button mat-icon-button (click)="changePassword()">
        <mat-icon>key</mat-icon>
      </button>
      <button mat-icon-button (click)="changeData()">
        <mat-icon>settings</mat-icon>
      </button>
      @if (data && !data?.isMyProfile) {
        <button mat-icon-button (click)="delete(data.id)">
          <mat-icon>delete</mat-icon>
        </button>
      }
    </top-bar>
    @if (data) {
      <mat-card appearance="outlined">
        <mat-card-content>
          Логин:{{ data.login }}
        </mat-card-content>
      </mat-card>
    }
  `
})
export default class UsersAddComponent {

  private injector = inject(Injector)
  private drawer = inject(DrawerService)
  private dialog = inject(MatDialog)
  private service = inject(UsersService)
  data$: Observable<UserDirty> = this.service.item$().pipe(share())

  @Input({ transform: numberAttribute, alias: 'id' })
  set _id(id: number) {
    this.service.downloadOne(id)
  }

  changePassword() {
    this.drawer.openDrawer(UserPasswordDrawerComponent, {
      mode: 'over',
      position: 'end',
      largeMode: true,
      cmpData: { id: this.service.item()?.id },
      closeOnNavigation: true,
      injector: this.injector
    })
  }

  changeData() {
    this.drawer.openDrawer(UserRolesDrawer, {
      mode: 'over',
      position: 'end',
      largeMode: true,
      cmpData: this.service.item() as UserDirty,
      closeOnNavigation: true,
      injector: this.injector
    })
  }

  delete(id: number) {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          content: '<p>Удалить сотрудника?</p>'
        } as ConfirmDialog
      })
      .afterClosed()
      .subscribe((toDelete?: boolean) => {
        if (toDelete) this.service.delete(id)
      })
  }
}
