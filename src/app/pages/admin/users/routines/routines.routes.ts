import { Routes } from '@angular/router';

import { RoutinesComponent } from './routines.component';
import { RoutineFormComponent } from './routine-form/routine-form.component';

export default [
  {
    path: '',
    component: RoutinesComponent,
  },
  {
    path: 'create',
    component: RoutineFormComponent,
  },
  {
    path: ':id/edit',
    component: RoutineFormComponent,
  },
] as Routes;
