import { inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from './http-service';

export class StorageKeys {
  public static USER_EMAIL = 'ymed:user:email';
  public static USER_ID = 'ymed:user:id';
  public static USER_LOGGED_IN = 'ymed:user:logged:in';
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly httpService = inject(HttpService);
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
    // this.notification.show('notification.auth.login', { username });
    // const login = btoa(`${username}:${password}`);
    // localStorage.setItem(StorageKeys.USER_LOGIN, login);
    // this.httpService
    //   .get<LoginResult>('/check-user')
    //   .pipe(takeUntilDestroyed(this.destroyRef))
    //   .subscribe((value: LoginResult) => {
    //     if (value.successful) {
    //       localStorage.setItem(StorageKeys.USER_LOGGED_IN, 'true');
    //       localStorage.setItem(StorageKeys.USER_NAME, username);
    //       const returnUrl =
    //         this.route.snapshot?.queryParams['returnUrl'] ?? '/dashboard';
    //       this.router.navigateByUrl(returnUrl);
    //     } else {
    //       localStorage.setItem(StorageKeys.USER_LOGGED_IN, 'false');
    //     }
    //   });

    localStorage.setItem(StorageKeys.USER_LOGGED_IN, 'true');
    localStorage.setItem(StorageKeys.USER_EMAIL, email);

    const returnUrl =
      this.route.snapshot?.queryParams['returnUrl'] ?? '/dashboard';
    this.router.navigateByUrl(returnUrl);
  }

  public logout(): void {
    // this.notification.show('notification.auth.logout', {
    //   username: localStorage.getItem(StorageKeys.USER_NAME),
    // });

    localStorage.removeItem(StorageKeys.USER_LOGGED_IN);
    localStorage.removeItem(StorageKeys.USER_EMAIL);
    localStorage.removeItem(StorageKeys.USER_ID);

    this.router.navigate(['/login']);
  }
}
