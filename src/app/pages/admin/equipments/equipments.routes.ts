import { Routes } from '@angular/router';

import { EquipmentsComponent } from './equipments.component';
import { EquipmentsFormComponent } from './equipments-form/equipments-form.component';

export default [
  {
    path: '',
    component: EquipmentsComponent,
  },
  {
    path: 'create',
    component: EquipmentsFormComponent,
  },
  {
    path: ':id/edit',
    component: EquipmentsFormComponent,
  },
] as Routes;
