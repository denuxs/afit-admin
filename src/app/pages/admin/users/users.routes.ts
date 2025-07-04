import { Routes } from '@angular/router';

import { UsersComponent } from './users.component';

import { UserFormComponent } from './user-form/user-form.component';

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
    component: UserFormComponent,
  },
  // {
  //   path: ':id/workouts',
  //   component: UserWorkoutsComponent,
  // },
  {
    path: ':id/edit',
    component: UserFormComponent,
  },
] as Routes;
