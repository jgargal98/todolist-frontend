import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Nora from '@primeuix/themes/nora';
import { provideStore } from '@ngxs/store';
import { AuthState } from './store/auth/auth.state';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    providePrimeNG({
      ripple: true,
      theme: {
        preset: Nora,
        options: {
          darkModeSelector: '.p-dark',
        },
      },
    }),
    provideStore([AuthState]),
  ],
};
