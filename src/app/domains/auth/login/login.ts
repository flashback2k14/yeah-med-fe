import { Component, inject, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslocoDirective } from '@jsverse/transloco';

import { AuthService } from '../../../core/services/auth-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrl: './login.scss',
  imports: [
    FormsModule,
    TranslocoDirective,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
  ],
})
export class LoginComponent {
  protected email = model<string>('');
  protected password = model<string>('');
  protected hide = signal(true);

  private readonly authService = inject(AuthService);

  togglePassword(event: MouseEvent): void {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  onSubmit(): void {
    this.authService.login(this.email(), this.password());
    this.email.set('');
    this.password.set('');
  }
}
