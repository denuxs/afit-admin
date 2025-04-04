import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

import { environment } from '../../environments/environment';
import { Dashboard } from 'app/domain/dashboard';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly _httpClient = inject(HttpClient);
  private _api: string = environment.BACKEND_API + '/dashboard/';

  constructor() {}

  fetchDashboard(): Observable<Dashboard> {
    return this._httpClient.get<Dashboard>(this._api).pipe(
      catchError(() => {
        return throwError(() => new Error('Error getting dashboard'));
      }),
    );
  }
}
