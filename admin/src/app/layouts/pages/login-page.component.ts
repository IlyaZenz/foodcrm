import { Component, inject } from '@angular/core'
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms'
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardTitle
} from '@angular/material/card'
import {
  MatError,
  MatFormField,
  MatLabel,
  MatSuffix
} from '@angular/material/form-field'
import { MatInput } from '@angular/material/input'
import { MatIcon } from '@angular/material/icon'
import { MatButton, MatIconButton } from '@angular/material/button'
import { AuthService } from '../../core/auth/auth.service'
import { finalize, first } from 'rxjs'

interface UserLogin {
  login: FormControl<string>
  password: FormControl<string>
}

@Component({
  standalone: true,
  styles: `
    .login-page {
      margin: 0.1em;
    }
  `,
  imports: [
    ReactiveFormsModule,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatFormField,
    MatInput,
    MatError,
    MatLabel,
    MatSuffix,
    MatIcon,
    MatCardActions,
    MatButton,
    MatIconButton
  ],
  template: `
    <div
      class="d-flex justify-content-center align-items-center h-100 login-page">
      <form [formGroup]="form" (submit)="login()">
        <mat-card appearance="outlined">
          <mat-card-header>
            <mat-card-title>Войти</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <mat-form-field class="w-100" appearance="outline">
              <input
                type="text"
                autocomplete="on"
                formControlName="login"
                matInput />
              <mat-label>Логин</mat-label>
              <mat-error>Введите логин</mat-error>
            </mat-form-field>
            <mat-form-field class="w-100" appearance="outline">
              <input
                [type]="isPasswordVisible ? 'text' : 'password'"
                autocomplete="on"
                formControlName="password"
                matInput />
              <mat-label>Пароль</mat-label>
              <mat-error>Введите пароль</mat-error>
              <button
                mat-icon-button
                matSuffix
                type="button"
                (click)="togglePasswordState()">
                <mat-icon>{{
                  isPasswordVisible ? 'visibility_on' : 'visibility_off'
                }}</mat-icon>
              </button>
            </mat-form-field>
          </mat-card-content>
          <mat-card-actions>
            <button [disabled]="isSending" mat-flat-button type="submit">
              <mat-icon>login</mat-icon>
              Войти
            </button>
          </mat-card-actions>
        </mat-card>
      </form>
    </div>
  `
})
export default class LoginPageComponent {
  form: FormGroup<UserLogin> = new FormGroup<UserLogin>({
    login: new FormControl<string>('', {
      nonNullable: true,
      validators: Validators.required
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: Validators.required
    })
  })

  isSending: boolean = false
  isPasswordVisible: boolean = false

  private auth = inject(AuthService)

  togglePasswordState() {
    this.isPasswordVisible = !this.isPasswordVisible
  }

  login() {
    this.form.markAllAsTouched()
    if (!this.form.valid) return

    this.isSending = true

    this.auth
      .login(this.form.value as { login: string; password: string })
      .pipe(
        finalize(() => (this.isSending = false)),
        first()
      )
      .subscribe()
  }
}
