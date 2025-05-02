import { Routes } from '@angular/router';

import { MeasuresComponent } from './measures.component';
import { MeasureCreateComponent } from './measure-create/measure-create.component';
import { MeasureEditComponent } from './measure-edit/measure-edit.component';

export default [
  {
    path: '',
    component: MeasuresComponent,
  },
  {
    path: 'create',
    component: MeasureCreateComponent,
  },
  {
    path: ':id/edit',
    component: MeasureEditComponent,
  },
] as Routes;
