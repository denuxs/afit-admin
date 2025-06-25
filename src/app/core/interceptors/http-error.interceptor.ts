import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpStatusCode,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { ToastMessageService } from '../services/toast-message.service';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const _toastMessageService = inject(ToastMessageService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // if (error.status == HttpStatusCode.BadRequest) {
      //   const errors = error.error;

      //   _toastMessageService.sendMessage('Error guardando los datos.');
      //   return throwError(() => errors);
      // }

      // if (error.status == HttpStatusCode.Unauthorized) {
      //   _toastMessageService.sendMessage(
      //     'No está autorizado para realizar esta acción.'
      //   );
      // }

      // if (error.status == HttpStatusCode.Forbidden) {
      //   _toastMessageService.sendMessage(
      //     'No está autorizado para realizar esta acción.'
      //   );
      // }

      // if (error.status == HttpStatusCode.NotFound) {
      //   _toastMessageService.sendMessage('No se encontró el recurso.');
      // }

      if (error.status == HttpStatusCode.InternalServerError) {
        _toastMessageService.sendMessage('Error interno del servidor.');
      }

      return throwError(() => error);
    })
  );
};
