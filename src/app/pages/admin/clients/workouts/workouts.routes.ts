import { Routes } from '@angular/router';

import { WorkoutFormComponent } from './workout-form/workout-form.component';
import { WorkoutsComponent } from './workouts.component';

export default [
  {
    path: '',
    component: WorkoutsComponent,
  },
  {
    path: 'create',
    component: WorkoutFormComponent,
  },
  {
    path: ':id/edit',
    component: WorkoutFormComponent,
  },
] as Routes;
