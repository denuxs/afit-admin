import { Routes } from '@angular/router';

import { RoutinesComponent } from './routines.component';
import { RoutineCreateComponent } from './routine-create/routine-create.component';
import { RoutineEditComponent } from './routine-edit/routine-edit.component';

export default [
  {
    path: '',
    component: RoutinesComponent,
  },
  {
    path: 'create',
    component: RoutineCreateComponent,
  },
  {
    path: ':id/edit',
    component: RoutineEditComponent,
  },
] as Routes;
