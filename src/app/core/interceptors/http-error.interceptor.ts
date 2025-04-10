import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastMessageService } from '../services/toast-message.service';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const _toastMessageService = inject(ToastMessageService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status == 400) {
        const errors = error.error;

        _toastMessageService.sendMessage('Error guardando los datos.');
        return throwError(() => errors);
      }

      if (error.status == 401) {
        _toastMessageService.sendMessage(
          'No está autorizado para realizar esta acción.',
        );
      }

      if (error.status == 403) {
        _toastMessageService.sendMessage(
          'No está autorizado para realizar esta acción.',
        );
      }

      if (error.status == 404) {
        _toastMessageService.sendMessage('No se encontró el recurso.');
      }

      if (error.status == 500) {
        _toastMessageService.sendMessage('Error interno del servidor.');
      }

      return throwError(() => error);
    }),
  );
};
