import { inject } from '@angular/core';
import {
  CanActivateFn,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { NotifyService } from '../services/notify-service';
import { AuthService } from '../services/auth-service';
import { NotifyType } from '../../shared/components/notify/notify';

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

  router.navigate(['signin'], { queryParams: { returnUrl: state.url } });
  return false;
};
