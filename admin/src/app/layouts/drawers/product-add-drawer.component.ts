import { Component, inject, Input } from '@angular/core'
import { DrawerHeaderComponent } from '../_main/drawer/drawer-header.component'
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButton } from '@angular/material/button'
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field'
import { MatInput } from '@angular/material/input'
import { ProductService } from '../../data/services/products.service'

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
      <ng-container ngProjectAs="title">Добавить товар</ng-container>
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
    <button mat-flat-button (click)="save()" >Сохранить</button>

  `
})
export class ProductAddDrawerComponent {

  private service = inject(ProductService)


  form: FormGroup<{ title: FormControl}> = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    })
  })

  save() {
    this.form.markAllAsTouched()
    if (this.form.invalid) {
      return
    }
    this.service.add({ title: this.form.value.title})
  }
}
