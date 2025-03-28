import { Component, inject } from '@angular/core'
import { DrawerHeaderComponent } from '../_main/drawer/drawer-header.component'
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButton } from '@angular/material/button'
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field'
import { MatInput } from '@angular/material/input'
import { CategoriesService } from '../../data/services/categories.service'

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
      <ng-container ngProjectAs="title">Добавить категорию</ng-container>
    </drawer-header>
    <mat-form-field class="w-100" appearance="outline">
      <input type="text" matInput [formControl]="form.controls.title" />
      <mat-label>Название категории</mat-label>
      <mat-error>
        @if (form.controls.title.hasError('required')) {
          Введите название
        }
      </mat-error>
    </mat-form-field>
    <mat-form-field class="w-100" appearance="outline">
      <input type="text" matInput [formControl]="form.controls.titleKz" />
      <mat-label>Название категории KZ</mat-label>
    </mat-form-field>
    <button mat-flat-button (click)="save()">Сохранить</button>

  `
})
export class CategoryAddDrawerComponent {

  private service = inject(CategoriesService)

  form: FormGroup<{ title: FormControl; titleKz: FormControl }> = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    titleKz: new FormControl('', {
      nonNullable: false
    })
  })

  save() {
    this.form.markAllAsTouched()
    if (this.form.invalid) {
      return
    }
    this.service.add(this.form.value as { title: string; titleKz: string })
  }
}
