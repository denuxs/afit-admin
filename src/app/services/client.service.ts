import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';

import { environment } from '../../environments/environment';
import { Client, ClientList, Measure } from 'app/interfaces';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private readonly _httpClient = inject(HttpClient);
  private _api: string = environment.BACKEND_API + '/clients/';

  all(params?: any): Observable<Client[]> {
    return this._httpClient.get<Client[]>(this._api, { params });
  }

  search(params?: any): Observable<ClientList> {
    return this._httpClient.get<ClientList>(this._api, { params });
  }

  get(id: number): Observable<Client> {
    return this._httpClient.get<Client>(this._api + `${id}/`);
  }

  create(body: FormData): Observable<Client> {
    return this._httpClient.post<Client>(this._api, body);
  }

  update(id: number, form: FormData): Observable<Client> {
    return this._httpClient.put<Client>(this._api + `${id}/`, form);
  }

  delete(id: number) {
    return this._httpClient.delete(this._api + `${id}/`);
  }

  measures(id: number): Observable<Measure[]> {
    return this._httpClient.get<Measure[]>(this._api + `${id}/measures/`);
  }
}
