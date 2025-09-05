import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';

import { TranslocoDirective } from '@jsverse/transloco';

import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'ym-header',
  template: `
    <ng-container *transloco="let t; prefix: 'nav'">
      <div class="container">
        <mat-toolbar>
          <span routerLink="/dashboard" class="title">
            {{ t('title') }}
          </span>

          <span class="spacer"></span>

          @if (authService.isLoggedIn()) {
          <a routerLink="/dashboard" routerLinkActive="underline">
            {{ t('dashboard') }}
          </a>

          <a routerLink="/settings" routerLinkActive="underline">
            {{ t('settings') }}
          </a>

          <a routerLink="/dashboard" (click)="authService.logout()">
            {{ t('actions.logout') }}
          </a>
          } @else {
          <a routerLink="/login">
            {{ t('actions.login') }}
          </a>
          }
        </mat-toolbar>
      </div>
    </ng-container>
  `,
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslocoDirective,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    RouterLinkActive,
  ],
})
export class HeaderComponent {
  protected readonly authService = inject(AuthService);
}
