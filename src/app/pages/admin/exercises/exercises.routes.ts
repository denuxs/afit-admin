import { Routes } from '@angular/router';

import { ExercisesComponent } from './exercises.component';
import { ExerciseFormComponent } from './exercise-form/exercise-form.component';

export default [
  {
    path: '',
    component: ExercisesComponent,
  },
  {
    path: 'create',
    component: ExerciseFormComponent,
  },
  {
    path: ':id/edit',
    component: ExerciseFormComponent,
  },
] as Routes;
