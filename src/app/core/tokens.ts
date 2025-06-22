import { InjectionToken } from '@angular/core';

export const API_BASE_URL: InjectionToken<string> = new InjectionToken<string>(
  'API_BASE_URL'
);

export const APP_VERSION: InjectionToken<string> = new InjectionToken<string>(
  'APP_VERSION'
);
