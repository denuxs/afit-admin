import { Routes } from '@angular/router';

import { UsersComponent } from './users.component';

import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserFormComponent } from './user-form/user-form.component';

export default [
  {
    path: '',
    component: UsersComponent,
  },
  {
    path: 'create',
    component: UserFormComponent,
  },
  {
    path: ':id/edit',
    component: UserFormComponent,
  },
  {
    path: ':id/view',
    component: UserDetailComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'workouts' },
      {
        path: 'workouts',
        loadChildren: () => import('./routines/routines.routes'),
      },
      {
        path: 'measures',
        loadChildren: () => import('./measures/measures.routes'),
      },
    ],
  },
] as Routes;
