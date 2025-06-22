import { inject } from '@angular/core';
import {
  CanActivateFn,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from './auth-service';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  //   const notification = inject(NotificationService);

  if (authService.isLoggedIn()) {
    return true;
  }

  //   notification.showLazy('notification.auth.redirect');

  router.navigate(['login'], { queryParams: { returnUrl: state.url } });
  return false;
};
