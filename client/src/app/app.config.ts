import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './_interceptor/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimations(), // Deprecated, but still required for ngx-toastr animations to work properly
    provideToastr({
      progressBar: true,
      newestOnTop: true,
      preventDuplicates: true,
      timeOut: 5500,
      closeButton: true,
      positionClass: 'toast-top-right',
      toastClass: 'ngx-toastr custom-toastr-dimensions',
    }),
    provideHttpClient(
      withFetch(), //use the Fetch API instead of XMLHttpRequests
      withInterceptors([authInterceptor])
    ),
    provideRouter(routes),
  ]
};
