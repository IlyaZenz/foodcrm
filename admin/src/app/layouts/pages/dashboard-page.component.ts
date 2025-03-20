import { Component } from '@angular/core'
import { MatCard, MatCardContent } from '@angular/material/card'
import { TopBar } from '../_main/navs/top-bar.component'

@Component({
  imports: [MatCard, MatCardContent, TopBar],
  styles: `
    .container {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      gap: 10px;
      @media (max-width: 599px) {
        grid-template-columns: 1fr;
      }
    }
  `,
  template: `
    <div class="pane-wrapper">
      <div class="pane">
        <top-bar menuButton>
          <ng-container ngProjectAs="title">food crm</ng-container>
          <div></div>
        </top-bar>
        <div class="container">
          <mat-card appearance="outlined" class="h-100">
            <mat-card-content> Виджет 1</mat-card-content>
          </mat-card>
          <mat-card appearance="outlined" class="h-100">
            <mat-card-content> Виджет 1</mat-card-content>
          </mat-card>
          <mat-card appearance="outlined" class="h-100">
            <mat-card-content> Виджет 1</mat-card-content>
          </mat-card>
          <mat-card appearance="outlined" class="h-100">
            <mat-card-content> Виджет 1</mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>
  `
})
export default class DashboardPageComponent {}
