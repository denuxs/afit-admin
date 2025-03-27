import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

import { environment } from '../../environments/environment';
import { Catalog, CatalogDto, CatalogParams } from 'app/domain';

@Injectable({
  providedIn: 'root',
})
export class CatalogService {
  private readonly _httpClient = inject(HttpClient);
  private _api: string = environment.BACKEND_API + '/catalogs/';

  constructor() {}

  fetchCatalogs(params: Partial<CatalogParams>): Observable<Catalog[]> {
    return this._httpClient.get<Catalog[]>(this._api, { params }).pipe(
      catchError(() => {
        return throwError(() => new Error('Error getting catalogs'));
      }),
    );
  }

  showCatalog(id: number): Observable<Catalog> {
    return this._httpClient.get<Catalog>(this._api + `${id}/`).pipe(
      catchError(() => {
        return throwError(() => new Error('Error getting catalog'));
      }),
    );
  }

  saveCatalog(body: CatalogDto): Observable<Catalog> {
    return this._httpClient.post<Catalog>(this._api, body).pipe(
      catchError(() => {
        return throwError(() => new Error('Error saving catalog'));
      }),
    );
  }

  updateCatalog(id: number, form: CatalogDto): Observable<Catalog> {
    return this._httpClient.put<Catalog>(this._api + `${id}/`, form).pipe(
      catchError(() => {
        return throwError(() => new Error('Error updating catalog'));
      }),
    );
  }
}
