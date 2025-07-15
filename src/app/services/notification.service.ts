import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

import { environment } from '../../environments/environment';
import { Notification, NotificationList } from 'app/interfaces';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly _httpClient = inject(HttpClient);
  private _api: string = environment.BACKEND_API + '/notifications/';

  search(params?: any): Observable<NotificationList> {
    return this._httpClient.get<NotificationList>(this._api, { params });
  }

  delete(id: number) {
    return this._httpClient.delete(this._api + `${id}/`);
  }
}
