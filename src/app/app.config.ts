import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
  isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { environment } from '../environments/environment.development';
import { API_BASE_URL, APP_VERSION } from './core/tokens';
import { errorInterceptor } from './core/error-interceptor';
import { TranslocoHttpLoader } from './transloco-loader';
import { provideTransloco } from '@jsverse/transloco';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: API_BASE_URL,
      useValue: environment.apiBaseUrl,
    },
    {
      provide: APP_VERSION,
      useValue: environment.appVersion,
    },
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([errorInterceptor])),
    provideTransloco({
      config: {
        availableLangs: ['en'],
        defaultLang: 'en',
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
  ],
};
