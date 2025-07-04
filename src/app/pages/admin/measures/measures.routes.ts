import { Routes } from '@angular/router';

import { MeasuresComponent } from './measures.component';
import { MeasureFormComponent } from './measure-form/measure-form.component';

export default [
  {
    path: '',
    component: MeasuresComponent,
  },
  {
    path: 'create',
    component: MeasureFormComponent,
  },
  {
    path: ':id/edit',
    component: MeasureFormComponent,
  },
] as Routes;
