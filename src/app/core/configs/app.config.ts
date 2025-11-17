import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
  isDevMode,
  inject,
  provideAppInitializer,
} from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { MatIconRegistry } from '@angular/material/icon';
import { provideTransloco } from '@jsverse/transloco';

import { errorInterceptor } from '../interceptors/error-interceptor';
import { environment } from '../../../environments/environment';
import { TranslocoHttpLoader } from './transloco-loader';
import { API_BASE_URL, APP_VERSION } from '../tokens';
import { provideDateAdapter } from '../providers';
import { routes } from './app.routes';

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
    provideDateAdapter(),
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
        'shopping',
        sanitizer.bypassSecurityTrustResourceUrl('../assets/svg/shopping.svg')
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

      iconRegistry.addSvgIcon(
        'coupon',
        sanitizer.bypassSecurityTrustResourceUrl('../assets/svg/coupon.svg')
      );

      iconRegistry.addSvgIcon(
        'inuse',
        sanitizer.bypassSecurityTrustResourceUrl('../assets/svg/inuse.svg')
      );

      iconRegistry.addSvgIcon(
        'add-shopping',
        sanitizer.bypassSecurityTrustResourceUrl(
          '../assets/svg/add-shopping.svg'
        )
      );
    }),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([errorInterceptor])),
    provideTransloco({
      config: {
        availableLangs: ['de', 'en'],
        defaultLang: 'en',
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
  ],
};
