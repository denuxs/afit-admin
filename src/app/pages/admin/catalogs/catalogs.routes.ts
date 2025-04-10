import { Routes } from '@angular/router';

import { CatalogsComponent } from './catalogs.component';
import { CatalogCreateComponent } from './catalog-create/catalog-create.component';
import { CatalogEditComponent } from './catalog-edit/catalog-edit.component';

export default [
  {
    path: '',
    component: CatalogsComponent,
  },
  {
    path: 'create',
    component: CatalogCreateComponent,
  },
  {
    path: ':id/edit',
    component: CatalogEditComponent,
  },
] as Routes;
