import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';

import { adminResolver } from './resolvers/admin.resolver';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'admin' },
  {
    path: 'signin',
    loadComponent: () =>
      import('./pages/auth/login/login.component').then(
        (c) => c.LoginComponent,
      ),
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    resolve: {
      initialData: adminResolver,
    },
    canActivate: [adminGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/admin/dashboard/dashboard.component').then(
            (c) => c.DashboardComponent,
          ),
      },
      {
        path: 'posts',
        loadChildren: () => import('./pages/admin/posts/posts.routes'),
      },
      {
        path: 'comments',
        loadChildren: () => import('./pages/admin/comments/comments.routes'),
      },
      {
        path: 'routines',
        loadChildren: () => import('./pages/admin/routines/routines.routes'),
      },
      {
        path: 'exercises',
        loadChildren: () => import('./pages/admin/exercises/exercises.routes'),
      },
      {
        path: 'measures',
        loadChildren: () => import('./pages/admin/measures/measures.routes'),
      },
      {
        path: 'users',
        loadChildren: () => import('./pages/admin/users/users.routes'),
      },
      {
        path: 'catalogs',
        loadChildren: () => import('./pages/admin/catalogs/catalogs.routes'),
      },
      // {
      //   path: 'equipments',
      //   loadChildren: () =>
      //     import('./pages/admin/equipments/equipments.routes'),
      // },
    ],
  },
  {
    path: 'not-found',
    pathMatch: 'full',
    loadComponent: () =>
      import('./pages/notfound/notfound.component').then(
        (c) => c.NotfoundComponent,
      ),
  },
  { path: '**', redirectTo: 'not-found', pathMatch: 'full' },
];
