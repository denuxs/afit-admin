import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../auth/auth.service';
import { UserService } from 'app/services';
import { map, tap } from 'rxjs';
import { User } from 'app/interfaces';

export const adminGuard: CanActivateFn = (route, state) => {
  const _router: Router = inject(Router);
  const _authService = inject(AuthService);
  const _userService = inject(UserService);

  if (!_authService.check()) {
    _router.navigateByUrl('/signin');
    return false;
  }

  _userService.profile().subscribe();

  return _userService.user$.pipe(
    map((user: User) => {
      if (user.role == 'admin' && user.is_active) {
        return true;
      }

      _authService.logout();
      _router.navigateByUrl('/signin');
      return false;
    })
  );
};
