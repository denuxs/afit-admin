import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const _router = inject(Router);
  const _authService = inject(AuthService);

  let newReq = req.clone();

  if (_authService.accessToken) {
    newReq = req.clone({
      headers: req.headers.set(
        'Authorization',
        'Bearer ' + _authService.accessToken,
      ),
    });
  }

  return next(newReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (
        error instanceof HttpErrorResponse &&
        // !newReq.url.includes('auth/login') &&
        error.status === 401
      ) {
        _authService.logout();
        _router.navigate(['/signin']);
      }

      return throwError(() => error);
    }),
  );
};
