import { Routes } from '@angular/router';

import { MusclesComponent } from './muscles.component';
import { MusclesFormComponent } from './muscles-form/muscles-form.component';

export default [
  {
    path: '',
    component: MusclesComponent,
  },
  {
    path: 'create',
    component: MusclesFormComponent,
  },
  {
    path: ':id/edit',
    component: MusclesFormComponent,
  },
] as Routes;
