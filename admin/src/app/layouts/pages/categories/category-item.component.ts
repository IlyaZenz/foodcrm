import { Component, inject, Injector, Input, numberAttribute } from '@angular/core'
import { MatCard, MatCardContent } from '@angular/material/card'
import { MatIcon } from '@angular/material/icon'
import { MatIconButton } from '@angular/material/button'
import { TopBar } from '../../_main/navs/top-bar.component'
import { DrawerService } from '../../_main/drawer/drawer.service'
import { MatDialog } from '@angular/material/dialog'
import { Observable, share } from 'rxjs'
import { Category } from '../../../data/interfaces/category.interface'
import { CategoriesService } from '../../../data/services/categories.service'
import { AsyncPipe } from '@angular/common'
import { ConfirmDialog, ConfirmDialogComponent } from '../../dialogs/confirm-dialog.component'
import { Banner } from '../../../data/interfaces/banner.interface'
import { CategoryDataDrawerComponent } from '../../drawers/category-data-drawer.component'

@Component({
  providers: [CategoriesService],
  imports: [MatCard, MatCardContent, MatIcon, MatIconButton, TopBar, AsyncPipe],
  template: `
    @let data = data$ | async;
    <top-bar  backUrl=".." backUrlOnCompact=".." sticky>
      @if (data){
        <button mat-icon-button (click)="changeData()">
          <mat-icon>edit</mat-icon>
        </button>
        <button mat-icon-button (click)="delete(data.id)">
          <mat-icon>delete</mat-icon>
        </button>
      }
    </top-bar>
    @if (data) {
      <mat-card appearance="outlined">
        <mat-card-content> Категория: {{ data.title }}</mat-card-content>
      </mat-card>
      <mat-card appearance="outlined">
        <mat-card-content> Категория КЗ: {{ data.titleKz }}</mat-card-content>
      </mat-card>
      @if (data.isActive) {
        <mat-card appearance="outlined">
          <mat-card-content> Категория активна</mat-card-content>
        </mat-card>
      } @else {
        <mat-card appearance="outlined">
          <mat-card-content> Категория не активна</mat-card-content>
        </mat-card>
      }
    }
  `
})
export default class CategoryItemComponent {
  private injector = inject(Injector)
  private drawer = inject(DrawerService)
  private dialog = inject(MatDialog)
  private service = inject(CategoriesService)
  data$: Observable<Category> = this.service.item$().pipe(share())

  @Input({ alias: 'categoryUrl' })
  set _url(url: string) {
    this.service.downloadOne(url)
  }

  changeData() {
    this.drawer.openDrawer(CategoryDataDrawerComponent, {
      mode: 'over',
      position: 'end',
      largeMode: true,
      cmpData: this.service.item() as Banner,
      closeOnNavigation: true,
      injector: this.injector
    })
  }


  delete(id: number) {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          content: '<p>Удалить категорию?</p>'
        } as ConfirmDialog
      })
      .afterClosed()
      .subscribe((toDelete?: boolean) => {
        if (toDelete) this.service.delete(id)
      })
  }
}
