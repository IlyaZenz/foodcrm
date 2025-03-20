import { Component, inject } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from "@angular/material/dialog";
import { MatButton } from "@angular/material/button";

export interface ConfirmDialog {
  title?: string;
  content?: string;
  btnAcceptLabel?: string;
  btnCancelLabel?: string;
}

@Component({
  standalone: true,
  template: `
    <h2 mat-dialog-title>{{ data?.title ?? "Подтвердите" }}</h2>
    <mat-dialog-content
      class="mat-typography"
      [innerHtml]="data?.content ?? '<p>Вы уверены что хотите продолжить?</p>'"
    >
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>
        {{ data?.btnAcceptLabel ?? "Отмена" }}
      </button>
      <button mat-button [mat-dialog-close]="true" cdkFocusInitial>
        {{ data?.btnAcceptLabel ?? "Продолжить" }}
      </button>
    </mat-dialog-actions>
  `,
  imports: [
    MatDialogActions,
    MatButton,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
  ],
})
export class ConfirmDialogComponent {
  data?: ConfirmDialog = inject(MAT_DIALOG_DATA);
}
