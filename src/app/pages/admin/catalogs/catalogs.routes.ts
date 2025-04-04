import { Routes } from '@angular/router';

import { CatalogsComponent } from './catalogs.component';
import { CatalogsFormComponent } from './catalogs-form/catalogs-form.component';

export default [
  {
    path: '',
    component: CatalogsComponent,
  },
  {
    path: 'create',
    component: CatalogsFormComponent,
  },
  {
    path: ':id/edit',
    component: CatalogsFormComponent,
  },
] as Routes;
