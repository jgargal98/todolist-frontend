import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Nora from '@primeuix/themes/nora';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
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
