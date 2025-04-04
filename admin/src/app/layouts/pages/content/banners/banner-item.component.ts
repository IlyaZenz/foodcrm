import {
  Component,
  inject,
  Injector,
  Input,
  numberAttribute
} from '@angular/core'
import { MatIcon } from '@angular/material/icon'
import { MatButton, MatIconButton } from '@angular/material/button'
import { TopBar } from '../../../_main/navs/top-bar.component'
import { MatCard, MatCardContent } from '@angular/material/card'
import { first, Observable, share } from 'rxjs'
import { BannerService } from '../../../../data/services/banners.service'
import { AsyncPipe } from '@angular/common'
import { Banner } from '../../../../data/interfaces/banner.interface'
import { MatDialog } from '@angular/material/dialog'
import {
  ConfirmDialog,
  ConfirmDialogComponent
} from '../../../dialogs/confirm-dialog.component'
import { DrawerService } from '../../../_main/drawer/drawer.service'
import { BannerDataDrawerComponent } from '../../../drawers/banner-data-drawer.component'
import { ImagesService } from '../../../../core/handlers/images/images.service'
import { environment } from '../../../../../environments/environment.local'

@Component({
  imports: [
    MatIcon,
    MatIconButton,
    TopBar,
    MatCard,
    MatCardContent,
    AsyncPipe,
    MatButton
  ],
  providers: [ImagesService],
  template: `
    @let data = data$ | async;
    <top-bar backUrlOnCompact=".." sticky>
      <button mat-icon-button (click)="changeData()">
        <mat-icon>edit</mat-icon>
      </button>
      @if (data) {
        <button mat-icon-button (click)="addPhoto(data.id)">
          <mat-icon>add_photo_alternate</mat-icon>
        </button>
        <button mat-icon-button (click)="delete(data.id)">
          <mat-icon>delete</mat-icon>
        </button>
      }
    </top-bar>
    @if (data) {
      <mat-card appearance="outlined">
        <mat-card-content> Баннер: {{ data.title }}</mat-card-content>
      </mat-card>
      <mat-card appearance="outlined">
        <mat-card-content> Описание: {{ data.content }}</mat-card-content>
      </mat-card>
      @if (data.image) {
        <mat-card appearance="outlined" class="d-flex flex-column align-items-center">
          <mat-card-content
            ><img [src]="url + data.image" alt="123"
          /></mat-card-content>
          <button mat-button class="w-100" (click)="deleteImage(data.id)">
            <mat-icon>delete</mat-icon>
            <span>Удалить</span>
          </button>
        </mat-card>
      }
    }
  `
})
export default class BannerItemComponent {
  private service = inject(BannerService)
  private dialog = inject(MatDialog)
  private drawer = inject(DrawerService)
  private injector = inject(Injector)
  private imageService = inject(ImagesService)
  url = environment.imageUrl
  data$: Observable<Banner> = this.service.item$().pipe(share())

  @Input({ transform: numberAttribute, alias: 'id' })
  set _id(id: number) {
    this.service.downloadOne(id)
  }

  addPhoto(id: number) {
    const files$ = this.imageService.pick([], {
      multiple: true,
      fileType: 'images'
    })
    this.imageService.uploadOne(files$, `api/banners/${id}/images`).subscribe({
      next: () => {
        this.service.downloadOne(id)
      }
    })
  }

  deleteImage(id: number) {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          content: '<p>Удалить изображение ?</p>'
        } as ConfirmDialog
      })
      .afterClosed()
      .subscribe((toDelete?: boolean) => {
        if (toDelete) this.service.deleteImage(id).pipe(first()).subscribe({})
      })
  }

  changeData() {
    this.drawer.openDrawer(BannerDataDrawerComponent, {
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
          content: '<p>Удалить баннер?</p>'
        } as ConfirmDialog
      })
      .afterClosed()
      .subscribe((toDelete?: boolean) => {
        if (toDelete) this.service.delete(id)
      })
  }
}
