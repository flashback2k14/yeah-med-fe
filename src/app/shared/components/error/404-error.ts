import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'ym-404-error',
  template: `
    <ng-container *transloco="let t; prefix: '404'">
      <div class="container">
        <div class="card">
          <h1 class="title">
            {{ t('title') }}
          </h1>
          <p class="line-one">
            {{ t('line1') }}
          </p>
          <p class="line-two">
            {{ t('line2') }}
          </p>
          <a matButton="filled" routerLink="/dashboard" class="go-back">
            {{ t('button') }}
          </a>
        </div>
      </div>
    </ng-container>
  `,
  styleUrl: './404-error.scss',
  imports: [TranslocoDirective, RouterLink, MatButtonModule],
})
export class FourZeroFourErrorComponent {}
