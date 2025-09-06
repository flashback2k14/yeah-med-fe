import {
  ChangeDetectionStrategy,
  Component,
  inject,
  model,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslocoDirective } from '@jsverse/transloco';
import { AuthService } from '../../core/services/auth-service';
import { NotifyService } from '../../core/services/notify-service';

@Component({
  selector: 'ym-sign-up',
  template: `
    <ng-container *transloco="let t; prefix: 'signup'">
      <div class="container">
        <mat-card appearance="raised">
          <mat-card-header>
            <mat-card-title>{{ t('title') }}</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>
              <mat-form-field appearance="fill">
                <mat-label>{{ t('email.label') }}</mat-label>
                <input
                  matInput
                  type="email"
                  [placeholder]="t('email.placeholder')"
                  required=""
                  [(ngModel)]="email"
                  autofocus
                />
              </mat-form-field>
            </p>
            <p>
              <mat-form-field>
                <mat-label>{{ t('password.label') }}</mat-label>
                <input
                  matInput
                  [type]="hide() ? 'password' : 'text'"
                  [placeholder]="t('password.placeholder')"
                  required=""
                  [(ngModel)]="password"
                />
                <button
                  matIconButton
                  matSuffix
                  (click)="togglePassword($event)"
                  [attr.aria-label]="'Hide password'"
                  [attr.aria-pressed]="hide()"
                >
                  <mat-icon>{{
                    hide() ? 'visibility_off' : 'visibility'
                  }}</mat-icon>
                </button>
              </mat-form-field>
            </p>
            <p>
              <mat-form-field>
                <mat-label>{{ t('passwordAgain.label') }}</mat-label>
                <input
                  matInput
                  [type]="hideAgain() ? 'password' : 'text'"
                  [placeholder]="t('passwordAgain.placeholder')"
                  required=""
                  [(ngModel)]="passwordAgain"
                />
                <button
                  matIconButton
                  matSuffix
                  (click)="togglePasswordAgain($event)"
                  [attr.aria-label]="'Hide password'"
                  [attr.aria-pressed]="hideAgain()"
                >
                  <mat-icon>{{
                    hideAgain() ? 'visibility_off' : 'visibility'
                  }}</mat-icon>
                </button>
              </mat-form-field>
            </p>
          </mat-card-content>
          <mat-card-actions align="end">
            <button matButton="filled" (click)="onSubmit()">
              {{ t('submit') }}
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </ng-container>
  `,
  styleUrl: './auth.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    TranslocoDirective,
  ],
})
export class SignUpComponent {
  protected email = model<string>('');
  protected password = model<string>('');
  protected passwordAgain = model<string>('');
  protected hide = signal(true);
  protected hideAgain = signal(true);

  private readonly authService = inject(AuthService);
  private readonly notifyService = inject(NotifyService);

  togglePassword(event: MouseEvent): void {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  togglePasswordAgain(event: MouseEvent): void {
    this.hideAgain.set(!this.hideAgain());
    event.stopPropagation();
  }

  onSubmit(): void {
    if (this.password() !== this.passwordAgain()) {
      this.notifyService.show('notification.auth.password-mismatch');
      return;
    }

    this.authService.signup(this.email(), this.password());
    this.email.set('');
    this.password.set('');
    this.passwordAgain.set('');
  }
}
