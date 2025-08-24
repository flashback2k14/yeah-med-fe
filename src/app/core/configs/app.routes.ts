import { Routes } from '@angular/router';
import { authGuard } from '../guards/auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('../../domains/auth/login/login').then((c) => c.LoginComponent),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('../../domains/dashboard/dashboard').then(
        (c) => c.DashboardComponent
      ),
  },
  // {
  //   path: 'settings',
  //   canActivate: [authGuard],
  //   loadComponent: () =>
  //     import('../../domains/settings/settings').then(
  //       (c) => c.SettingsComponent
  //     ),
  // },
  {
    path: '404',
    loadComponent: () =>
      import('../../shared/components/error/404-error').then(
        (c) => c.FourZeroFourErrorComponent
      ),
  },
  {
    path: '**',
    redirectTo: '404',
  },
];
