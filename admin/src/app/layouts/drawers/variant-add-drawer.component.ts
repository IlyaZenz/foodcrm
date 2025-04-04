import { Component, inject } from '@angular/core'
import { DrawerHeaderComponent } from '../_main/drawer/drawer-header.component'
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButton } from '@angular/material/button'
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field'
import { MatInput } from '@angular/material/input'
import { CategoriesService } from '../../data/services/categories.service'
import { ProductService } from '../../data/services/products.service'
import { first } from 'rxjs'

@Component({
  imports: [
    DrawerHeaderComponent,
    FormsModule,
    MatButton,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule
  ],
  template: `
    <drawer-header>
      <ng-container ngProjectAs="title">Добавить Вариант</ng-container>
    </drawer-header>
    <mat-form-field class="w-100" appearance="outline">
      <input type="text" matInput [formControl]="form.controls.title" />
      <mat-label>Название варианта</mat-label>
      <mat-error>
        @if (form.controls.title.hasError('required')) {
          Введите название
        }
      </mat-error>
    </mat-form-field>
    <mat-form-field class="w-100" appearance="outline">
      <input type="text" matInput [formControl]="form.controls.price" />
      <mat-label>Цена</mat-label>
      <mat-error>
        @if (form.controls.price.hasError('pattern')) {
          Только числовые значения
        }
      </mat-error>
    </mat-form-field>
    <button mat-flat-button (click)="save()">Сохранить</button>

  `
})
export class VariantAddDrawerComponent {

  private service = inject(ProductService)

  form: FormGroup<{ title: FormControl; price: FormControl<number | null> }> = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    price: new FormControl<number | null>(null, {
      nonNullable: false,
      validators: [Validators.pattern(/^\d+$/)]
    })
  })

  save() {
    this.form.markAllAsTouched()
    if (this.form.invalid) {
      return
    }

    this.service.addProductVariant(this.form.value as { title: string, price?: number}).pipe(first()).subscribe()
  }
}

