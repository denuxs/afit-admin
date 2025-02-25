import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

import { environment } from '../../environments/environment';
import { Workout, WorkoutDto } from 'app/domain';

@Injectable({
  providedIn: 'root',
})
export class WorkoutService {
  private readonly _httpClient = inject(HttpClient);
  private _api: string = environment.BACKEND_API + '/workouts/';

  constructor() {}

  fetchWorkouts(): Observable<Workout[]> {
    return this._httpClient.get<Workout[]>(this._api).pipe(
      catchError(() => {
        return throwError(() => new Error('Error getting workouts'));
      }),
    );
  }

  showWorkout(id: number): Observable<Workout> {
    return this._httpClient.get<Workout>(`${this._api}${id}/`).pipe(
      catchError(() => {
        return throwError(() => new Error('Error getting workout'));
      }),
    );
  }

  saveWorkout(form: WorkoutDto): Observable<Workout> {
    return this._httpClient.post<Workout>(this._api, form).pipe(
      catchError(() => {
        return throwError(() => new Error('Error saving workout'));
      }),
    );
  }

  updateWorkout(id: number, form: WorkoutDto): Observable<Workout> {
    return this._httpClient.put<Workout>(this._api + `${id}/`, form).pipe(
      catchError(() => {
        return throwError(() => new Error('Error updating workout'));
      }),
    );
  }
}
