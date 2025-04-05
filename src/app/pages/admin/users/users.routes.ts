import { Routes } from '@angular/router';

import { UsersComponent } from './users.component';

import { UserCreateComponent } from './user-create/user-create.component';
import { UserEditComponent } from './user-edit/user-edit.component';

export default [
  {
    path: '',
    component: UsersComponent,
  },
  {
    path: 'create',
    component: UserCreateComponent,
  },
  {
    path: ':id/edit',
    component: UserEditComponent,
  },
] as Routes;
