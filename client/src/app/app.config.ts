import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';

import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimations(),
    provideToastr({
      progressBar: true,
      newestOnTop: true,
      preventDuplicates: true,
      timeOut: 3500,
      closeButton: true,
      positionClass: 'toast-top-center',
    }),
    provideHttpClient(withFetch()),
    provideRouter(routes),
  ]
};
