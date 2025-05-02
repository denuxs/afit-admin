import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Workout, WorkoutDto } from 'app/domain';

@Injectable({
  providedIn: 'root',
})
export class WorkoutService {
  private readonly _httpClient = inject(HttpClient);
  private _api: string = environment.BACKEND_API + '/workouts/';

  constructor() {}

  fetchWorkouts(params?: any): Observable<Workout[]> {
    return this._httpClient.get<Workout[]>(this._api, { params });
  }

  showWorkout(id: number): Observable<Workout> {
    return this._httpClient.get<Workout>(`${this._api}${id}/`);
  }

  saveWorkout(form: WorkoutDto): Observable<Workout> {
    return this._httpClient.post<Workout>(this._api, form);
  }

  updateWorkout(id: number, form: WorkoutDto): Observable<Workout> {
    return this._httpClient.put<Workout>(this._api + `${id}/`, form);
  }

  deleteDetailExercise(id: number) {
    return this._httpClient.delete(
      environment.BACKEND_API + `/workouts-detail/${id}/`
    );
  }

  delete(id: number) {
    return this._httpClient.delete(this._api + `${id}/`);
  }
}
