import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { of, switchMap } from 'rxjs';

export const noAuthGuard: CanActivateFn = (route, state) => {
  const _router: Router = inject(Router);
  const _authService = inject(AuthService);

  return _authService.check().pipe(
    switchMap(authenticated => {
      if (authenticated) {
        return of(_router.parseUrl(''));
      }

      return of(true);
    })
  );
};
