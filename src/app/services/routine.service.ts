import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Routine, RoutineDto, RoutineList } from 'app/interfaces';

@Injectable({
  providedIn: 'root',
})
export class RoutineService {
  private readonly _httpClient = inject(HttpClient);
  private _api: string = environment.BACKEND_API + '/routines/';

  all(params?: any): Observable<Routine[]> {
    return this._httpClient.get<Routine[]>(this._api, { params });
  }

  search(params?: any): Observable<RoutineList> {
    return this._httpClient.get<RoutineList>(this._api, { params });
  }

  get(id: number): Observable<Routine> {
    return this._httpClient.get<Routine>(`${this._api}${id}/`);
  }

  create(form: RoutineDto): Observable<Routine> {
    return this._httpClient.post<Routine>(this._api, form);
  }

  update(id: number, form: RoutineDto): Observable<Routine> {
    return this._httpClient.put<Routine>(this._api + `${id}/`, form);
  }

  delete(id: number) {
    return this._httpClient.delete(this._api + `${id}/`);
  }

  deleteDetailExercise(id: number) {
    return this._httpClient.delete(
      environment.BACKEND_API + `/routineexercises/${id}/`
    );
  }
}
