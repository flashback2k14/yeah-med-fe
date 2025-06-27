import { inject } from '@angular/core';
import {
  CanActivateFn,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from './auth-service';
import { NotifyService } from '../notify/notify-service';
import { NotifyType } from '../notify/notify';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const notification = inject(NotifyService);
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  notification.show('notification.auth.redirect', {}, NotifyType.WARNING);

  router.navigate(['login'], { queryParams: { returnUrl: state.url } });
  return false;
};
