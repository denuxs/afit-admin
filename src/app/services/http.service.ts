import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { throwError } from 'rxjs';

import { ToastMessageService } from 'app/core/services/toast-message.service';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private _toastMessageService = inject(ToastMessageService);

  constructor() {}

  handleError(error: HttpErrorResponse) {
    if (error.status === 400) {
      const errors = error.error;

      this._toastMessageService.sendMessage('An error occurred');
    }

    return throwError(() => error);
  }
}
