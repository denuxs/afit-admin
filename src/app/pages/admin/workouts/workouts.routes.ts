import { Routes } from '@angular/router';

import { WorkoutsComponent } from './workouts.component';
import { WorkoutFormComponent } from './workout-form/workout-form.component';

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
