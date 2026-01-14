import { APP_INITIALIZER, ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpService } from './shared/services/http.service';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { provideAnimations } from '@angular/platform-browser/animations';

function load(httpService: HttpService): void | import("rxjs").Observable<unknown> | Promise<unknown> {
 console.log('app running')
}

export const appConfig: ApplicationConfig = {
    providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    provideAppInitializer(() => {
      const httpService = inject(HttpService);
      return load(httpService);
    }),
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    ] 
};
