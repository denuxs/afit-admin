import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {

      if (error.status === 500) {
        return throwError(() => new Error('An error occurred'));
      }
      return throwError(() => error);
    })
  );
};
