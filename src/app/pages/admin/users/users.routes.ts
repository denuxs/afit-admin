import { Routes } from '@angular/router';

import { UsersComponent } from './users.component';

import { UserCreateComponent } from './user-create/user-create.component';
import { UserEditComponent } from './user-edit/user-edit.component';

export default [
  {
    path: '',
    component: UsersComponent,
  },
  // {
  //   path: ':userId',
  //   component: UserDetailComponent,
  //   children: [
  //     { path: '', pathMatch: 'full', redirectTo: 'workouts' },
  //     {
  //       path: 'workouts',
  //       loadComponent: () =>
  //         import('./workouts/workouts.component').then(
  //           c => c.WorkoutsComponent
  //         ),
  //     },
  //     {
  //       path: 'measures',
  //       loadComponent: () =>
  //         import('./measures/measures.component').then(
  //           c => c.MeasuresComponent
  //         ),
  //     },
  //   ],
  // },
  {
    path: 'create',
    component: UserCreateComponent,
  },
  // {
  //   path: ':id/workouts',
  //   component: UserWorkoutsComponent,
  // },
  {
    path: ':id/edit',
    component: UserEditComponent,
  },
] as Routes;
