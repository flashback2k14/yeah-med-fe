import { Routes } from '@angular/router';
import { authGuard } from '../guards/auth-guard';

export const routes: Routes = [
  {
    path: 'signin',
    loadComponent: () =>
      import('../../domains/auth/sign-in').then((c) => c.SignInComponent),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('../../domains/auth/sign-up').then((c) => c.SignUpComponent),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('../../domains/dashboard/dashboard').then(
        (c) => c.DashboardComponent
      ),
  },
  {
    path: 'shopping',
    canActivate: [authGuard],
    loadComponent: () =>
      import('../../domains/shopping/shopping').then(
        (c) => c.ShoppingComponent
      ),
  },
  {
    path: 'settings',
    canActivate: [authGuard],
    loadComponent: () =>
      import('../../domains/settings/settings').then(
        (c) => c.SettingsComponent
      ),
  },
  {
    path: '404',
    loadComponent: () =>
      import('../../shared/components/error/404-error').then(
        (c) => c.FourZeroFourErrorComponent
      ),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  {
    path: '**',
    redirectTo: '404',
  },
];
