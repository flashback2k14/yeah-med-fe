import { Component } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'ym-settings',
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
  imports: [TranslocoDirective],
})
export class SettingsComponent {}
