import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { AuthService } from '../auth/auth.service';
import { of, switchMap } from 'rxjs';

export const adminGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const _router: Router = inject(Router);
  const _authService = inject(AuthService);

  return _authService.check().pipe(
    switchMap(authenticated => {
      if (!authenticated) {
        const urlTree = _router.parseUrl('/signin');
        return of(urlTree);
      }

      return of(true);
    })
  );
};
