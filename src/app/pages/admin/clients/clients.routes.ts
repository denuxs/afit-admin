import { Routes } from '@angular/router';

import { ClientsComponent } from './clients.component';
import { ClientFormComponent } from './client-form/client-form.component';
import { MeasuresComponent } from './measures/measures.component';
import { WorkoutsComponent } from './workouts/workouts.component';

export default [
  {
    path: '',
    component: ClientsComponent,
  },
  {
    path: 'create',
    component: ClientFormComponent,
  },
  {
    path: ':id/edit',
    component: ClientFormComponent,
  },
  {
    path: ':id/measures',
    component: MeasuresComponent,
  },
  {
    path: ':id/workouts',
    component: WorkoutsComponent,
  },
] as Routes;
