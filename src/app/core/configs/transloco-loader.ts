import { inject, Injectable } from '@angular/core';
import {
  getBrowserLang,
  Translation,
  TranslocoLoader,
} from '@jsverse/transloco';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  private http = inject(HttpClient);

  getTranslation(lang: string) {
    const bl = getBrowserLang();
    return this.http.get<Translation>(`/assets/i18n/${bl}.json`);
  }
}
