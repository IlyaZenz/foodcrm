import { Component, inject, Injector } from '@angular/core'
import { MatIcon } from '@angular/material/icon'
import { MatIconButton } from '@angular/material/button'
import { TopBar } from '../../_main/navs/top-bar.component'
import { MatCard, MatCardContent } from '@angular/material/card'
import { MatDialog } from '@angular/material/dialog'
import { DrawerService } from '../../_main/drawer/drawer.service'
import { Observable, share } from 'rxjs'
import { CategoriesService } from '../../../data/services/categories.service'
import { Category } from '../../../data/interfaces/category.interface'
import { AsyncPipe } from '@angular/common'

@Component({
  imports: [MatIcon, MatIconButton, TopBar, MatCard, MatCardContent, AsyncPipe],
  template: `
    @let data = data$ | async;
    <top-bar backUrlOnCompact=".." sticky>
      <button mat-icon-button>
        <mat-icon>edit</mat-icon>
      </button>
      <button mat-icon-button>
        <mat-icon>delete</mat-icon>
      </button>
    </top-bar>
      <mat-card appearance="outlined">
        <mat-card-content> Категория:</mat-card-content>
      </mat-card>
      <mat-card appearance="outlined">
        <mat-card-content> Товары: </mat-card-content>
      </mat-card>


  `
})
export default class CategoryItemComponent {
  private service = inject(CategoriesService)
  private dialog = inject(MatDialog)
  private drawer = inject(DrawerService)
  private injector = inject(Injector)
  data$: Observable<Category> = this.service.item$().pipe(share())
}
