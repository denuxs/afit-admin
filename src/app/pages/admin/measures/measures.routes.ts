import { Routes } from '@angular/router';

import { MeasuresComponent } from './measures.component';
import { MeasuresFormComponent } from './measures-form/measures-form.component';

export default [
  {
    path: '',
    component: MeasuresComponent,
  },
  {
    path: 'create',
    component: MeasuresFormComponent,
  },
  {
    path: ':id/edit',
    component: MeasuresFormComponent,
  },
] as Routes;
