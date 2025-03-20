import { Component, inject, Input } from '@angular/core'
import { DrawerHeaderComponent } from '../_main/drawer/drawer-header.component'
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field'
import { MatInput } from '@angular/material/input'
import { BannerService } from '../../data/services/banners.service'
import { MatButton } from '@angular/material/button'
import { first } from 'rxjs'
import { UserDirty } from '../../data/interfaces/user.interface'
import { Banner } from '../../data/interfaces/banner.interface'

interface Form {
  title: FormControl<string>,
  content: FormControl<string>,
}

@Component({
  imports: [
    DrawerHeaderComponent,
    FormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatButton
  ],
  template: `
    <drawer-header>
      <ng-container ngProjectAs="title">Редактирование баннера</ng-container>
    </drawer-header>
    <mat-form-field class="w-100" appearance="outline">
      <input type="text" matInput [formControl]="form.controls.title" />
      <mat-label>Название</mat-label>
    </mat-form-field>
    <mat-form-field class="w-100" appearance="outline">
      <input type="text" matInput [formControl]="form.controls.content" />
      <mat-label>Описание</mat-label>
    </mat-form-field>
    <button mat-flat-button (click)="save()">Сохранить</button>
  `
})
export class BannerDataDrawerComponent {
  private service = inject(BannerService)

  @Input()
  set data(banner: Banner) {
    this.form.patchValue(banner)
  }

  form: FormGroup<Form> = new FormGroup<Form>({
    title: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.pattern('^[a-zA-Z0-9]+$')],
      asyncValidators: []
    }),
    content: new FormControl<string>('', {
      nonNullable: true,
      validators: [],
    })
  })

  save(){
    this.service.update({
      title: this.form.controls.title.value,
      content: this.form.controls.content.value
    }).pipe(first()).subscribe()
  }
}
