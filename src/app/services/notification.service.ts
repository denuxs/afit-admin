import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

import { environment } from '../../environments/environment';
import { Notification } from 'app/domain';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly _httpClient = inject(HttpClient);
  private _api: string = environment.BACKEND_API + '/notifications/';

  constructor() {}

  fetchNotifications(params: any): Observable<Notification[]> {
    return this._httpClient.get<Notification[]>(this._api, { params });
  }
}
