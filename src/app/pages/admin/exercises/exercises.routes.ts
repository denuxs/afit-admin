import { Routes } from '@angular/router';

import { ExercisesComponent } from './exercises.component';

import { ExerciseCreateComponent } from './exercise-create/exercise-create.component';
import { ExerciseEditComponent } from './exercise-edit/exercise-edit.component';

export default [
  {
    path: '',
    component: ExercisesComponent,
  },
  {
    path: 'create',
    component: ExerciseCreateComponent,
  },
  {
    path: ':id/edit',
    component: ExerciseEditComponent,
  },
] as Routes;
