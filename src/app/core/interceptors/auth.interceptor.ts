import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpStatusCode,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

import { AuthService } from '../auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const _router = inject(Router);
  const _authService = inject(AuthService);

  let newReq = req.clone();

  if (_authService.accessToken) {
    newReq = req.clone({
      headers: req.headers.set(
        'Authorization',
        'Bearer ' + _authService.accessToken
      ),
    });
  }
  // const newReq = req.clone({
  //   withCredentials: true,
  // });

  return next(newReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (
        error instanceof HttpErrorResponse &&
        // !newReq.url.includes('auth/login') &&
        (error.status === HttpStatusCode.Unauthorized ||
          error.status === HttpStatusCode.Forbidden)
      ) {
        _authService.logout();
        // location.reload();
        _router.navigate(['/signin']);
      }

      return throwError(() => error);
    })
  );
};
