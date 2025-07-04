import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';

import { environment } from '../../environments/environment';
import { Catalog, CatalogList, CatalogParams } from 'app/domain';

@Injectable({
  providedIn: 'root',
})
export class CatalogService {
  private readonly _httpClient = inject(HttpClient);
  private _api: string = environment.BACKEND_API + '/catalogs/';

  all(params?: any): Observable<Catalog[]> {
    return this._httpClient.get<Catalog[]>(this._api, { params });
  }

  search(params?: Partial<CatalogParams>): Observable<CatalogList> {
    return this._httpClient.get<CatalogList>(this._api, { params });
  }

  get(id: number): Observable<Catalog> {
    return this._httpClient.get<Catalog>(this._api + `${id}/`);
  }

  create(body: FormData): Observable<Catalog> {
    return this._httpClient.post<Catalog>(this._api, body);
  }

  update(id: number, form: FormData): Observable<Catalog> {
    return this._httpClient.put<Catalog>(this._api + `${id}/`, form);
  }

  delete(id: number) {
    return this._httpClient.delete(this._api + `${id}/`);
  }
}
