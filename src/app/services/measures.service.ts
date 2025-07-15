import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Measure, MeasureDto, MeasureList } from 'app/interfaces';

@Injectable({
  providedIn: 'root',
})
export class MeasuresService {
  private readonly _httpClient = inject(HttpClient);
  private _api: string = environment.BACKEND_API + '/measures/';

  all(params?: any): Observable<Measure[]> {
    return this._httpClient.get<Measure[]>(this._api, { params });
  }

  search(params?: any): Observable<MeasureList> {
    return this._httpClient.get<MeasureList>(this._api, { params });
  }

  get(id: number): Observable<Measure> {
    return this._httpClient.get<Measure>(this._api + `${id}/`);
  }

  create(body: MeasureDto): Observable<Measure> {
    return this._httpClient.post<Measure>(this._api, body);
  }

  update(id: number, body: MeasureDto): Observable<Measure> {
    return this._httpClient.put<Measure>(this._api + `${id}/`, body);
  }

  delete(id: number) {
    return this._httpClient.delete(this._api + `${id}/`);
  }
}
