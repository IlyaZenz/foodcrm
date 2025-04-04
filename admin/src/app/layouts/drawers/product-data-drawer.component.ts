import { Component, inject, Input } from "@angular/core"
import { DrawerHeaderComponent } from '../_main/drawer/drawer-header.component'
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButton } from '@angular/material/button'
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field'
import { MatInput } from '@angular/material/input'
import { ProductService } from '../../data/services/products.service'
import { MatSlideToggle } from '@angular/material/slide-toggle'
import { first } from "rxjs"
import { Category } from "../../data/interfaces/category.interface"
import { Product } from "../../data/interfaces/product.interface"

interface Form {
  title: FormControl<string>
  isNew: FormControl<boolean>
  isFavorite: FormControl<boolean>
  isActive: FormControl<boolean>
}

@Component({
  imports: [
    DrawerHeaderComponent,
    FormsModule,
    MatButton,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatSlideToggle
  ],
  template: `
    <drawer-header>
      <ng-container ngProjectAs="title">Редактировать товар</ng-container>
    </drawer-header>
    <mat-form-field class="w-100" appearance="outline">
      <input type="text" matInput [formControl]="form.controls.title" />
      <mat-label>Название товара</mat-label>
      <mat-error>
        @if (form.controls.title.hasError('required')) {
          Введите название
        }
      </mat-error>
    </mat-form-field>
    <p
      ><mat-slide-toggle [formControl]="form.controls.isFavorite"
        labelPosition="before"
        >В избранных</mat-slide-toggle
      ></p
    >
    <p
    ><mat-slide-toggle  [formControl]="form.controls.isNew"
      labelPosition="before"
    >Новинка</mat-slide-toggle
    ></p>
    <p
    ><mat-slide-toggle  [formControl]="form.controls.isActive"
                        labelPosition="before"
    >Активная</mat-slide-toggle
    ></p>
    <button mat-flat-button (click)="save()">Сохранить</button>
  `
})
export class ProductDataDrawerComponent {

  private service = inject(ProductService)

  @Input()
  set data(product: Product) {
    this.form.patchValue(product)
  }

  form: FormGroup<Form> = new FormGroup<Form>({
    title: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.pattern('^[a-zA-Z0-9]+$')],
      asyncValidators: []
    }),
    isNew: new FormControl<boolean>(false, {
      nonNullable: true,
      validators: []
    }),
    isFavorite: new FormControl<boolean>(false, {
      nonNullable: true,
      validators: []
    }),
    isActive: new FormControl<boolean>(false, {
      nonNullable: true,
      validators: []
    }),
  })

  save(){
    this.service.update({
      title: this.form.controls.title.value,
      isNew: this.form.controls.isNew.value,
      isFavorite: this.form.controls.isFavorite.value,
      isActive: this.form.controls.isActive.value,
    }).pipe(first()).subscribe()
  }
}
