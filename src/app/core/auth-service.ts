import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from './http-service';
import { NotifyService } from '../notify/notify-service';

export class StorageKeys {
  public static USER_EMAIL = 'ymed:user:email';
  public static USER_ID = 'ymed:user:id';
  public static USER_LOGGED_IN = 'ymed:user:logged:in';
}

export type User = {
  userId: string;
  email: string;
  createdAt: Date;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  message: string;
  user: User;
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly notifyService = inject(NotifyService);
  private readonly httpService = inject(HttpService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  public isLoggedIn(): boolean {
    const valid = localStorage.getItem(StorageKeys.USER_LOGGED_IN) ?? false;
    if (!valid) {
      return false;
    }
    return JSON.parse(valid) as boolean;
  }

  public async login(email: string, password: string): Promise<void> {
    this.notifyService.show('notification.auth.login', { email });

    this.httpService
      .create<LoginRequest, LoginResponse>('/users/login', { email, password })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value: LoginResponse) => {
        if (value.message === 'Login Success') {
          localStorage.setItem(StorageKeys.USER_LOGGED_IN, 'true');
          localStorage.setItem(StorageKeys.USER_EMAIL, value.user.email);
          localStorage.setItem(StorageKeys.USER_ID, value.user.userId);

          const returnUrl =
            this.route.snapshot?.queryParams['returnUrl'] ?? '/dashboard';
          this.router.navigateByUrl(returnUrl);
        } else {
          this.notifyService.showError((value as any)?.error);
          localStorage.setItem(StorageKeys.USER_LOGGED_IN, 'false');
        }
      });
  }

  public logout(): void {
    this.notifyService.show('notification.auth.logout', {
      username: localStorage.getItem(StorageKeys.USER_EMAIL),
    });

    localStorage.removeItem(StorageKeys.USER_LOGGED_IN);
    localStorage.removeItem(StorageKeys.USER_EMAIL);
    localStorage.removeItem(StorageKeys.USER_ID);

    this.router.navigate(['/login']);
  }
}
