import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Measure, MeasureDto, MeasureList } from 'app/domain';

@Injectable({
  providedIn: 'root',
})
export class MeasuresService {
  private readonly _httpClient = inject(HttpClient);
  private _api: string = environment.BACKEND_API + '/measures/';

  fetchMeasures(params: any): Observable<MeasureList> {
    return this._httpClient.get<MeasureList>(this._api, { params });
  }

  showMeasure(id: number): Observable<Measure> {
    return this._httpClient.get<Measure>(this._api + `${id}/`);
  }

  saveMeasure(form: MeasureDto): Observable<Measure> {
    return this._httpClient.post<Measure>(this._api, form);
  }

  updateMeasure(id: number, form: MeasureDto): Observable<Measure> {
    return this._httpClient.put<Measure>(this._api + `${id}/`, form);
  }

  saveImage(id: number, form: FormData): Observable<Measure> {
    return this._httpClient.patch<Measure>(this._api + `${id}/`, form);
  }

  delete(id: number) {
    return this._httpClient.delete(this._api + `${id}/`);
  }
}
