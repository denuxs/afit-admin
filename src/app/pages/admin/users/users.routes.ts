import { Routes } from '@angular/router';

import { UsersComponent } from './users.component';
import { UserFormComponent } from './user-form/user-form.component';

export default [
  {
    path: '',
    component: UsersComponent,
  },
  {
    path: 'create',
    component: UserFormComponent,
  },
  {
    path: ':id/edit',
    component: UserFormComponent,
  },
] as Routes;
