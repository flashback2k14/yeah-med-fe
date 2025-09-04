import { Component, inject } from '@angular/core';

import { MatDividerModule } from '@angular/material/divider';

import { TranslocoDirective } from '@jsverse/transloco';
import { APP_VERSION } from '../../core/tokens';

@Component({
  selector: 'ym-settings',
  template: `
    <ng-container *transloco="let t; prefix: 'settings'">
      <div class="container">
        <h2 class="title">
          {{ t('information.title') }}
        </h2>

        <mat-divider />

        <p>{{ t('information.version', {version}) }}</p>
      </div>
    </ng-container>
  `,
  styleUrl: './settings.scss',
  imports: [MatDividerModule, TranslocoDirective],
})
export class SettingsComponent {
  protected version = inject(APP_VERSION);
}
