import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Dashboard } from 'app/interfaces';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly _httpClient = inject(HttpClient);
  private _api: string = environment.BACKEND_API + '/dashboard/';

  fetchDashboard(): Observable<Dashboard> {
    return this._httpClient.get<Dashboard>(this._api);
  }
}
