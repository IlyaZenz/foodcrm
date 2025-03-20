import {
  ApplicationConfig,
  importProvidersFrom,
  inject,
  provideEnvironmentInitializer,
  provideZoneChangeDetection
} from '@angular/core'
import {
  provideRouter,
  withComponentInputBinding,
  withViewTransitions
} from '@angular/router'

import { routes } from '../routes/app.routes'
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'
import {provideHttpClient, withFetch, withInterceptors} from '@angular/common/http'
import {
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatSnackBarModule
} from '@angular/material/snack-bar'
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt'
import { CustomMatIconService } from '../handlers/custom-mat-icons/custom-mat-icon.service'
import {authInterceptor} from '../auth/auth.interceptor';
import {urlApiTransformInterceptor} from '../interceptors/url-api-transform.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding(), withViewTransitions()),
    provideAnimationsAsync(),
    provideHttpClient(withFetch(),withInterceptors([authInterceptor])),
    importProvidersFrom(MatSnackBarModule),
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: { duration: 2000 }
    },
    JwtHelperService,
    {
      provide: JWT_OPTIONS,
      useValue: JWT_OPTIONS
    },
    provideEnvironmentInitializer(() => {
      inject(CustomMatIconService).init()
    })
  ]
}
