import { Component, inject, Input, OnInit } from '@angular/core'
import { DrawerHeaderComponent } from '../_main/drawer/drawer-header.component'
import {
  AbstractControl,
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  ReactiveFormsModule, ValidationErrors,
  Validators
} from '@angular/forms'
import { Role } from '../../core/auth/rolls.enum'
import { MatListOption, MatSelectionList } from '@angular/material/list'
import { MatButton } from '@angular/material/button'
import { UsersService } from '../../data/services/users.service'
import { catchError, first, map, Observable, of } from 'rxjs'
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field'
import { MatInput } from '@angular/material/input'
import { UserDirty } from '../../data/interfaces/user.interface'

interface Form {
  login: FormControl<string>,
  isMyProfile: FormControl<boolean>,
  roles: FormControl<string[]>
}

@Component({
  imports: [
    DrawerHeaderComponent,
    MatSelectionList,
    MatListOption,
    ReactiveFormsModule,
    MatButton,
    MatError,
    MatFormField,
    MatInput,
    MatLabel
  ],
  template: `
    <drawer-header>
      <ng-container ngProjectAs="title">Права доступа</ng-container>
    </drawer-header>
    <mat-selection-list [formControl]="form.controls.roles">
      @for (role of roles; track role) {
        <mat-list-option
          [value]="role"
          [disabled]="isMyProfile && isManageUserRole(role)">{{ role }}
        </mat-list-option>
      }
    </mat-selection-list>

    <mat-form-field class="w-100" appearance="outline">
      <input type="text" matInput [formControl]="form.controls.login">
      <mat-label>Логин</mat-label>
      <mat-error>
        @if (form.controls.login.hasError('pattern')) {
          Только латинские символы и цифры
        } @else if (form.controls.login.hasError('required')) {
          Введите логин
        }
      </mat-error>
    </mat-form-field>
    <button mat-flat-button (click)="save()">Сохранить</button>
  `
})

export class UserRolesDrawer {
  roles: Role[] = Object.values(Role)

  private service = inject(UsersService)
  private currentLogin: string | null = null

  form: FormGroup<Form> = new FormGroup<Form>({
    login: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$')],
      asyncValidators: []
    }),
    isMyProfile: new FormControl<boolean>(false, { nonNullable: true }),
    roles: new FormControl<string[]>([], { nonNullable: true })
  })

  get isMyProfile():boolean {
    return this.form.controls.isMyProfile.value
  }

  @Input()
  set data(userDirty: UserDirty) {
    this.form.patchValue(userDirty)
  }


  isManageUserRole(role: string): boolean {
    return role === Role.admin
  }

  save() {
    this.service.update({
      roles: this.form.controls.roles.value as Role[],
      login: this.form.controls.login.value
    }).pipe(first()).subscribe()
  }
}
