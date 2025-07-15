import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Workout, WorkoutDto, WorkoutList } from 'app/interfaces';

@Injectable({
  providedIn: 'root',
})
export class WorkoutService {
  private readonly _httpClient = inject(HttpClient);
  private _api: string = environment.BACKEND_API + '/workouts/';

  search(params?: any): Observable<WorkoutList> {
    return this._httpClient.get<WorkoutList>(this._api, { params });
  }

  get(id: number): Observable<Workout> {
    return this._httpClient.get<Workout>(`${this._api}${id}/`);
  }

  create(form: WorkoutDto): Observable<Workout> {
    return this._httpClient.post<Workout>(this._api, form);
  }

  update(id: number, form: WorkoutDto): Observable<Workout> {
    return this._httpClient.put<Workout>(this._api + `${id}/`, form);
  }

  delete(id: number) {
    return this._httpClient.delete(this._api + `${id}/`);
  }

  deleteDetailExercise(id: number) {
    return this._httpClient.delete(
      environment.BACKEND_API + `/workouts-detail/${id}/`
    );
  }
}
