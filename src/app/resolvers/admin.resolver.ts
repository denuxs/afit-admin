import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from 'app/core';

export const adminResolver: ResolveFn<any> = (route, state) => {
  const _userService = inject(UserService);
  return _userService.profile();
};
