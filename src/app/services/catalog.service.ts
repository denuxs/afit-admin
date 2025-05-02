import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';

import { environment } from '../../environments/environment';
import { Catalog, CatalogList, CatalogDto, CatalogParams } from 'app/domain';

@Injectable({
  providedIn: 'root',
})
export class CatalogService {
  private readonly _httpClient = inject(HttpClient);
  private _api: string = environment.BACKEND_API + '/catalogs/';

  fetchCatalogs(params?: Partial<CatalogParams>): Observable<CatalogList> {
    return this._httpClient.get<CatalogList>(this._api, { params });
  }

  showCatalog(id: number): Observable<Catalog> {
    return this._httpClient.get<Catalog>(this._api + `${id}/`);
  }

  saveCatalog(body: CatalogDto): Observable<Catalog> {
    return this._httpClient.post<Catalog>(this._api, body);
  }

  updateCatalog(id: number, form: CatalogDto): Observable<Catalog> {
    return this._httpClient.put<Catalog>(this._api + `${id}/`, form);
  }

  delete(id: number) {
    return this._httpClient.delete(this._api + `${id}/`);
  }
}
