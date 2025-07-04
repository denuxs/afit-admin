import { ResolveFn } from '@angular/router';
import { UserService } from '../services/user.service';
import { inject } from '@angular/core';

export const adminResolver: ResolveFn<any> = (route, state) => {
  const _userService = inject(UserService);
  return _userService.profile();
};
