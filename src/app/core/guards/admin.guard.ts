import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../auth/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const _router: Router = inject(Router);
  const _authService = inject(AuthService);

  if (!_authService.check()) {
    _router.navigateByUrl('/signin');
    return false;
  }

  return true;
};
