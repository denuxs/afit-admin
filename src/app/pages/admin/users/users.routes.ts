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
    path: ':userid/view',
    component: UserDetailComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'workouts' },
      {
        path: 'workouts/:userid',
        loadChildren: () => import('./routines/routines.routes'),
      },
      // {
      //   path: 'measures',
      //   loadChildren: () => import('./measures/measures.routes'),
      // },
    ],
  },
  {
    path: 'create',
    component: UserFormComponent,
  },
  {
    path: ':id/edit',
    component: UserFormComponent,
  },
] as Routes;
