import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifyService } from './notify-service';
import { HttpService } from './http-service';

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

  public isLoggedIn = signal(false);

  public signin(email: string, password: string): void {
    this.notifyService.show('notification.auth.signin', { email });

    this.httpService
      .create<LoginRequest, LoginResponse>('/users/signin', { email, password })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value: LoginResponse) => {
        if (value.message === 'Login Success') {
          localStorage.setItem(StorageKeys.USER_LOGGED_IN, 'true');
          localStorage.setItem(StorageKeys.USER_EMAIL, value.user.email);
          localStorage.setItem(StorageKeys.USER_ID, value.user.userId);

          this.isLoggedIn.set(true);

          const returnUrl =
            this.route.snapshot?.queryParams['returnUrl'] ?? '/dashboard';
          this.router.navigateByUrl(returnUrl);
        } else {
          this.notifyService.showError((value as any)?.error);
          localStorage.setItem(StorageKeys.USER_LOGGED_IN, 'false');
        }
      });
  }

  public signup(email: string, password: string): void {
    this.notifyService.show('notification.auth.signup', { email });

    this.httpService
      .create<LoginRequest, User>('/users/signup', { email, password })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value: User) => {
        if (value) {
          this.signin(email, password);
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

    this.isLoggedIn.set(false);

    this.router.navigate(['/signin']);
  }
}
