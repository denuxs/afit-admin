import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';

import { environment } from '../../environments/environment';
import { Company } from 'app/interfaces';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private readonly _httpClient = inject(HttpClient);
  private _api: string = environment.BACKEND_API + '/companies/';

  all(params?: any): Observable<Company[]> {
    return this._httpClient.get<Company[]>(this._api, { params });
  }
}
