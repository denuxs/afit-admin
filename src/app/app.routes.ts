import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { noAuthGuard } from './core/guards/no-auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'admin' },
  {
    path: 'signin',
    canActivate: [noAuthGuard],
    loadComponent: () =>
      import('./pages/auth/login/login.component').then(c => c.LoginComponent),
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    // resolve: {
    //   initialData: adminResolver,
    // },
    canActivate: [adminGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/admin/dashboard/dashboard.component').then(
            c => c.DashboardComponent
          ),
      },
      {
        path: 'notifications',
        loadChildren: () =>
          import('./pages/admin/notifications/notifications.routes'),
      },
      {
        path: 'comments',
        loadChildren: () => import('./pages/admin/comments/comments.routes'),
      },
      {
        path: 'users',
        loadChildren: () => import('./pages/admin/users/users.routes'),
      },
      {
        path: 'routines',
        loadChildren: () => import('./pages/admin/routines/routines.routes'),
      },
      {
        path: 'measures',
        loadChildren: () => import('./pages/admin/measures/measures.routes'),
      },
      {
        path: 'exercises',
        loadChildren: () => import('./pages/admin/exercises/exercises.routes'),
      },
      {
        path: 'catalogs',
        loadChildren: () => import('./pages/admin/catalogs/catalogs.routes'),
      },
      {
        path: 'profile',
        loadChildren: () => import('./pages/admin/profile/profile.routes'),
      },
      {
        path: 'settings',
        loadChildren: () => import('./pages/admin/settings/settings.routes'),
      },
    ],
  },
  {
    path: 'not-found',
    pathMatch: 'full',
    loadComponent: () =>
      import('./pages/notfound/notfound.component').then(
        c => c.NotfoundComponent
      ),
  },
  { path: '**', redirectTo: 'not-found', pathMatch: 'full' },
];
