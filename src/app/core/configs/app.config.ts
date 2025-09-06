import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
  isDevMode,
  inject,
  provideAppInitializer,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import {
  MAT_DATE_LOCALE,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { MatIconRegistry } from '@angular/material/icon';
import { provideTransloco } from '@jsverse/transloco';

import { environment } from '../../../environments/environment';
import { errorInterceptor } from '../interceptors/error-interceptor';
import { TranslocoHttpLoader } from './transloco-loader';
import { API_BASE_URL, APP_VERSION } from '../tokens';
import { routes } from './app.routes';

export const APP_DATE_FORMATS = {
  parse: {
    dateInput: 'DD.MM.YYYY',
  },
  display: {
    dateInput: 'DD.MM.YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

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
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'de-DE',
    },
    provideAppInitializer(() => {
      const iconRegistry = inject(MatIconRegistry);
      const sanitizer = inject(DomSanitizer);

      iconRegistry.addSvgIcon(
        'logout',
        sanitizer.bypassSecurityTrustResourceUrl('../assets/svg/logout.svg')
      );

      iconRegistry.addSvgIcon(
        'pill',
        sanitizer.bypassSecurityTrustResourceUrl('../assets/svg/pill.svg')
      );

      iconRegistry.addSvgIcon(
        'pills',
        sanitizer.bypassSecurityTrustResourceUrl('../assets/svg/pills.svg')
      );

      iconRegistry.addSvgIcon(
        'setting',
        sanitizer.bypassSecurityTrustResourceUrl('../assets/svg/setting.svg')
      );

      iconRegistry.addSvgIcon(
        'signin',
        sanitizer.bypassSecurityTrustResourceUrl('../assets/svg/signin.svg')
      );

      iconRegistry.addSvgIcon(
        'signup',
        sanitizer.bypassSecurityTrustResourceUrl('../assets/svg/signup.svg')
      );
    }),
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
    provideNativeDateAdapter(APP_DATE_FORMATS),
  ],
};
