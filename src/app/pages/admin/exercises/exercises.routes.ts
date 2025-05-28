import { Routes } from '@angular/router';

import { ExercisesComponent } from './exercises.component';
import { ExerciseViewComponent } from './exercise-view/exercise-view.component';

export default [
  {
    path: '',
    component: ExercisesComponent,
  },
  {
    path: ':id/view',
    component: ExerciseViewComponent,
  },
] as Routes;
