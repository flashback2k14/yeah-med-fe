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
            <mat-icon svgIcon="pill" />
            {{ t('title') }}
          </span>

          <span class="spacer"></span>

          @if (authService.isLoggedIn()) {
          <a routerLink="/dashboard" routerLinkActive="underline">
            <mat-icon svgIcon="pills" />
            {{ t('dashboard') }}
          </a>

          <span class="separator">|</span>

          <a routerLink="/settings" routerLinkActive="underline">
            <mat-icon svgIcon="setting" />
            {{ t('settings') }}
          </a>

          <span class="separator">|</span>

          <a routerLink="/dashboard" (click)="authService.logout()">
            <mat-icon svgIcon="logout" />
            {{ t('actions.logout') }}
          </a>
          } @else {
          <a routerLink="/signin" routerLinkActive="underline">
            <mat-icon svgIcon="signin" />
            {{ t('actions.login') }}
          </a>

          <span class="separator">|</span>

          <a routerLink="/signup" routerLinkActive="underline">
            <mat-icon svgIcon="signup" />
            {{ t('actions.signup') }}
          </a>
          }
        </mat-toolbar>
      </div>
    </ng-container>
  `,
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    RouterLink,
    RouterLinkActive,
    TranslocoDirective,
  ],
})
export class HeaderComponent {
  protected readonly authService = inject(AuthService);
}
