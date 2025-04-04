import { Component, inject, Input } from '@angular/core'
import { DrawerHeaderComponent } from '../_main/drawer/drawer-header.component'
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field'
import { MatInput } from '@angular/material/input'
import { MatButton } from '@angular/material/button'
import { Category } from '../../data/interfaces/category.interface'
import { CategoriesService } from '../../data/services/categories.service'
import { MatSlideToggle } from '@angular/material/slide-toggle'
import { first } from 'rxjs'

interface Form {
  title: FormControl<string>
  titleKz: FormControl<string>
  isActive: FormControl<boolean>
}

@Component({
  imports: [
    DrawerHeaderComponent,
    FormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatButton,
    MatSlideToggle
  ],
  template: `
    <drawer-header>
      <ng-container ngProjectAs="title">Редактирование категории</ng-container>
    </drawer-header>
    <mat-form-field class="w-100" appearance="outline">
      <input type="text" matInput [formControl]="form.controls.title" />
      <mat-label>Название</mat-label>
    </mat-form-field>
    <mat-form-field class="w-100" appearance="outline">
      <input type="text" matInput [formControl]="form.controls.titleKz" />
      <mat-label>Название KZ</mat-label>
    </mat-form-field>
    <p><mat-slide-toggle labelPosition="before" [formControl]="form.controls.isActive">Активировать категорию</mat-slide-toggle></p>
    <button mat-flat-button (click)="save()">Сохранить</button>
  `
})
export class CategoryDataDrawerComponent {
  private service = inject(CategoriesService)

  @Input()
  set data(category: Category) {
    this.form.patchValue(category)
  }

  form: FormGroup<Form> = new FormGroup<Form>({
    title: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.pattern('^[a-zA-Z0-9]+$')],
      asyncValidators: []
    }),
    titleKz: new FormControl<string>('', {
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
      titleKz: this.form.controls.titleKz.value,
      isActive: this.form.controls.isActive.value
    }).pipe(first()).subscribe()
  }
}
