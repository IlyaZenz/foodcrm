import { Component, inject, Input } from '@angular/core'
import { DrawerHeaderComponent } from '../_main/drawer/drawer-header.component'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field'
import { MatInput } from '@angular/material/input'
import { MatButton } from '@angular/material/button'
import { UsersService } from '../../data/services/users.service'

@Component({
  imports: [
    DrawerHeaderComponent,
    MatFormField,
    ReactiveFormsModule,
    MatError,
    MatLabel,
    MatInput,
    MatButton
  ],
  template: `
    <drawer-header>
      <ng-container ngProjectAs="title">Добавить сотрудника</ng-container>
    </drawer-header>
    <mat-form-field class="w-100" appearance="outline">
      <input type="text" matInput [formControl]="form.controls.login">
      <mat-label>Логин</mat-label>
      <mat-error>
        @if (form.controls.login.hasError('pattern')) {
          Только латинские символы и цифры
        } @else if (form.controls.login.hasError('required')) {
          Введите логин
        }
        @else if (form.controls.login.hasError('isExist')) {
          Такой логин уже существует
        }
      </mat-error>
    </mat-form-field>
    <mat-form-field class="w-100" appearance="outline">
      <input type="text" matInput [formControl]="form.controls.password">
      <mat-label>Пароль</mat-label>
      <mat-error>
        Введите пароль
      </mat-error>
    </mat-form-field>
    <button mat-flat-button (click)="save()">Сохранить</button>
  `
})

export class UserAddDrawerComponent {
  private service = inject(UsersService)

  form: FormGroup<{ login: FormControl, password: FormControl }> = new FormGroup({
    login: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$')],
      asyncValidators: [
        this.service.checkExistingUsername()
      ]
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    })
  })


  save() {
    this.form.markAllAsTouched()
    if (this.form.invalid) {
      return
    }
    this.service.add(this.form.value as { login: string; password: string })
  }
}
