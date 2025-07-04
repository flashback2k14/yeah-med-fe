import { Component, inject, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../core/auth-service';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  imports: [FormsModule, TranslocoDirective],
})
export class LoginComponent {
  protected email = model<string>('');
  protected password = model<string>('');

  private readonly authService = inject(AuthService);

  onSubmit(): void {
    this.authService.login(this.email(), this.password());
    this.email.set('');
    this.password.set('');
  }
}
