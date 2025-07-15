import { Routes } from '@angular/router';
import { authGuard } from '../guards/auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('../../domains/auth/login').then((c) => c.LoginComponent),
  },
  {
    path: '',
    canActivateChild: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('../../domains/dashboard/dashboard').then(
            (c) => c.DashboardComponent
          ),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('../../domains/settings/settings').then(
            (c) => c.SettingsComponent
          ),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: '**',
        redirectTo: 'dashboard',
      },
    ],
  },
];
