import { Component, inject, Injector, Input, numberAttribute } from '@angular/core'
import { BannerService } from '../../../../data/services/banners.service'
import { MatDialog } from '@angular/material/dialog'
import { DrawerService } from '../../../_main/drawer/drawer.service'
import { ImagesService } from '../../../../core/handlers/images/images.service'
import { environment } from '../../../../../environments/environment.local'
import { Observable, share } from 'rxjs'
import { ProductService } from '../../../../data/services/products.service'
import { Product } from '../../../../data/interfaces/product.interface'
import { AsyncPipe } from '@angular/common'
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle, MatCardTitleGroup
} from '@angular/material/card'
import { MatIcon } from '@angular/material/icon'
import { MatIconButton } from '@angular/material/button'
import { TopBar } from '../../../_main/navs/top-bar.component'
import { MatToolbar } from '@angular/material/toolbar'
import { MatList, MatListItem, MatListItemMeta } from '@angular/material/list'
import { CategoryDataDrawerComponent } from '../../../drawers/category-data-drawer.component'
import { Banner } from '../../../../data/interfaces/banner.interface'
import { ProductDataDrawerComponent } from '../../../drawers/product-data-drawer.component'
import { ConfirmDialog, ConfirmDialogComponent } from '../../../dialogs/confirm-dialog.component'
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu'
import { CategoryAddDrawerComponent } from '../../../drawers/category-add-drawer.component'
import { VariantAddDrawerComponent } from '../../../drawers/variant-add-drawer.component'


@Component({
  imports: [
    AsyncPipe,
    MatCard,
    MatCardContent,
    MatIcon,
    MatIconButton,
    TopBar,
    MatCardTitle,
    MatCardHeader,
    MatCardTitleGroup,
    MatList,
    MatListItem,
    MatMenuTrigger,
    MatMenuItem,
    MatMenu,
    MatListItemMeta
  ],
  styles: ``,
  template: `
    @let data = data$ | async;
    <top-bar backUrlOnCompact=".." sticky>
      @if (data) {
        <button mat-icon-button (click)="changeData()">
          <mat-icon>edit</mat-icon>
        </button>
        <button mat-icon-button (click)="delete(data.id)">
          <mat-icon>delete</mat-icon>
        </button>
      }
    </top-bar>
    @if (data) {
      <mat-card class="example-card" appearance="outlined">
        <mat-card-header>
          <mat-card-title>{{ data.title }}</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="product-details">
            <p>В избранных: {{ data.isFavorite ? 'Да' : 'Нет' }}</p>
            <p>Новинка: {{ data.isNew ? 'Да' : 'Нет' }}</p>
            <p>Активная: {{ data.isActive ? 'Да' : 'Нет' }}</p>
            <p>Url: {{ data.url }}</p>
          </div>
        </mat-card-content>
      </mat-card>
      <mat-card appearance="outlined">
        <mat-card-header>
          <mat-card-title-group>
            <mat-card-title>Варианты</mat-card-title>
            <button mat-icon-button (click)="add()">
              <mat-icon>add</mat-icon>
            </button>
          </mat-card-title-group>
        </mat-card-header>
        <mat-card-content>
          <mat-list>
            @if (data.variants) {
              @for (variant of data.variants; track variant) {
                <mat-list-item>
                  <img
                    matListItemAvatar
                    class="mr-8"
                    [src]="url + variant.image"
                    alt="" />
                  <div matListItemTitle>{{ variant.title }}</div>
                  <div matListItemLine>{{ variant.price }}</div>
                  <div matListItemMeta>
                    <button
                      mat-icon-button
                      [matMenuTriggerFor]="menu"
                      aria-label="Example icon-button with a menu">
                      <mat-icon>more_vert</mat-icon>
                    </button>
                  </div>
                </mat-list-item>
                <mat-menu #menu="matMenu">
                  <button mat-menu-item>
                    <mat-icon>edit</mat-icon>
                    <span>Изменить</span>
                  </button>
                  <button mat-menu-item (click)="deleteVariant(variant.id, data.url)">
                    <mat-icon>delete</mat-icon>
                    <span>Удалить</span>
                  </button>
                </mat-menu>
              }
            }
          </mat-list>
        </mat-card-content>
      </mat-card>
    }
  `
})
export default class ProductItemComponent {
  private service = inject(ProductService)
  private dialog = inject(MatDialog)
  private drawer = inject(DrawerService)
  private injector = inject(Injector)
  url = environment.imageUrl
  data$: Observable<Product> = this.service.item$().pipe(share())

  @Input({ alias: 'url' })
  set _url(url: string) {
    this.service.downloadOne(url)
  }

  add() {
    this.drawer.openDrawer(VariantAddDrawerComponent, {
      mode: 'over',
      position: 'end',
      largeMode: true,
      closeOnNavigation: true,
      injector: this.injector
    })
  }

  deleteVariant(id:number, url:string) {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          content: '<p>Удалить вариант?</p>'
        } as ConfirmDialog
      })
      .afterClosed()
      .subscribe((toDelete?: boolean) => {
        if (toDelete) this.service.deleteVariant(id,url)
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

  changeData() {
    this.drawer.openDrawer(ProductDataDrawerComponent, {
      mode: 'over',
      position: 'end',
      cmpData: this.service.item() as Product,
      largeMode: true,
      closeOnNavigation: true,
      injector: this.injector
    })
  }
}
