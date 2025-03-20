import { Component, inject, Input } from '@angular/core'
import { DrawerHeaderComponent } from '../_main/drawer/drawer-header.component'
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field'
import { MatInput } from '@angular/material/input'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButton } from '@angular/material/button'
import { UsersService } from '../../data/services/users.service'

@Component({
  imports: [
    DrawerHeaderComponent,
    MatFormField,
    MatError,
    MatLabel,
    MatInput,
    ReactiveFormsModule,
    MatButton
  ],
  template: `
    <drawer-header>
      <ng-container ngProjectAs="title">Изменить пароль</ng-container>
    </drawer-header>
    <p></p>
    <mat-form-field class="w-100" appearance="outline">
      <input type="text" matInput [formControl]="form.controls.password">
      <mat-label>Новый пароль</mat-label>
      <mat-error>Введите пароль</mat-error>
    </mat-form-field>
    <button mat-flat-button (click)="save()">Сохранить</button>
  `
})

export class UserPasswordDrawerComponent {
  @Input({ required: true }) data!: { id: number }

  private service = inject(UsersService)

  form: FormGroup<{ password: FormControl }> = new FormGroup({
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    })
  })

  save() {
    this.form.markAllAsTouched()
    if (this.form.invalid) return
    this.service.updatePassword(this.data.id, this.form.value.password)
  }
}
