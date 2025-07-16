import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpStatusCode,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { AuthService } from '../auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const _authService = inject(AuthService);

  req = req.clone({
    withCredentials: true,
  });

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (
        error instanceof HttpErrorResponse &&
        // !newReq.url.includes('auth/login') &&
        (error.status === HttpStatusCode.Unauthorized ||
          error.status === HttpStatusCode.Forbidden)
      ) {
        _authService.logout();
        location.reload();
        // _router.navigate(['/signin']);
      }

      return throwError(() => error);
    })
  );
};
