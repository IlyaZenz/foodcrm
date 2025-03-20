import { Component, inject, Input } from '@angular/core'
import { MainNavItem } from './main-nav-item.interface'
import { AuthService } from '../../../core/auth/auth.service'
import { MatIcon } from '@angular/material/icon'
import { RouterLink, RouterLinkActive } from '@angular/router'

@Component({
  selector: 'rail-nav',
  styles: `
    @use '@angular/material' as mat;
    @use '../../../../styles/md-theme.scss' as theme;

    :host {
      width: 88px;
    }

    .nav-rail {
      background-color: mat.get-theme-color(theme.$m3-light-theme, neutral, 95);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
      position: fixed;
      overflow-y: auto;
      z-index: 8;

      .nav-rail-content {
        display: flex;
        flex-direction: column;
        margin-top: 20px;
      }

      .nav-rail-exit-container {
        margin-bottom: 16px;
      }

      .nav-rail-content,
      .nav-rail-exit-container {
        a.section-link {
          text-decoration: none;
          cursor: pointer;
        }

        .section-link {
          width: 80px;
          margin: -2px auto 14px;
          padding: 2px;
          color: mat.get-theme-color(theme.$m3-light-theme, on-surface-variant);

          &:hover,
          &:focus,
          &:hover:focus {
            border: none;
            box-shadow: none;
            outline: none;
            color: mat.get-theme-color(theme.$m3-light-theme, on-surface);

            mat-icon {
              background: mat.get-theme-color(
                theme.$m3-light-theme,
                outline-variant
              );
              font-variation-settings:
                'wght' 600,
                'opsz' 24;
            }

            .label {
              font-variation-settings: 'GRAD' 50;
            }
          }

          &:active,
          &.active {
            color: mat.get-theme-color(theme.$m3-light-theme, on-surface);

            mat-icon {
              background: mat.get-theme-color(
                theme.$m3-light-theme,
                secondary-container
              );
              font-variation-settings:
                'FILL' 1,
                'wght' 400,
                'opsz' 24;
            }

            .label {
              font-variation-settings: 'GRAD' 125;
              color: mat.get-theme-color(
                theme.$m3-light-theme,
                on-secondary-container
              );
            }
          }

          mat-icon {
            &:before {
              position: absolute;
              width: 100%;
              height: 100%;
              opacity: 0;
              transform: scaleX(0.32);
              transition-duration: 0.2s;
              transition-property: transform, opacity;
              transition-timing-function: linear;
              border-radius: 100px;
              background: mat.get-theme-color(
                theme.$m3-light-theme,
                secondary-container
              );
              content: '';
              z-index: -1;
            }

            display: flex;
            position: relative;
            align-items: center;
            justify-content: center;
            width: 56px;
            height: 32px;
            margin-right: auto;
            margin-bottom: 4px;
            margin-left: auto;
            font-variation-settings:
              'wght' 400,
              'opsz' 24;
            transition:
              font-variation-settings 0.2s cubic-bezier(0.2, 0, 0, 1),
              backgroung 0.2s cubic-bezier(0.2, 0, 0, 1);
            border-radius: 16px;
          }

          .label {
            text-align: center;
            margin-bottom: 4px;
            transition: font-variation-settings 0.2s cubic-bezier(0.2, 0, 0, 1);
          }
        }
      }
    }
  `,
  imports: [MatIcon, RouterLinkActive, RouterLink],
  template: `
    <div class="nav-rail vt-rail">
      <div class="nav-rail-content">
        @for (link of items; track link) {
          <a
            class="section-link"
            routerLinkActive="active"
            [routerLink]="link.url"
            [routerLinkActiveOptions]="{ exact: link.url === '/' }">
            <mat-icon>{{ link.icon }}</mat-icon>
            <div class="label mat-label-medium ">{{ link.title }}</div>
          </a>
        }
      </div>
      <div class="nav-rail-exit-container"
        ><a class="section-link" (click)="logOut()">
          <mat-icon>logout</mat-icon>
          <div class="label mat-label-medium ">Выход</div>
        </a></div
      >
    </div>
  `
})
export class RailComponent {
  @Input({ required: true })
  items: MainNavItem[] = []

  private auth = inject(AuthService)

  logOut() {
    this.auth.logOut()
  }
}
