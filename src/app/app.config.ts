import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngxs/store';
import { providePrimeNG } from 'primeng/config';
import Nora from '@primeuix/themes/nora';

import { routes } from './app.routes';
import { AppStates } from './store';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { refreshTokenInterceptor } from './core/interceptors/refresh-token.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideStore(AppStates),
    provideHttpClient(
      withInterceptors([authInterceptor, refreshTokenInterceptor]),
    ),
    // PrimeNG theme preset + dark mode via CSS class toggle
    providePrimeNG({
      ripple: true,
      theme: {
        preset: Nora,
        options: {
          darkModeSelector: '.p-dark',
        },
      },
    }),
  ],
};
