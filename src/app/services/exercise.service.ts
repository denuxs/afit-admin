import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

import { environment } from '../../environments/environment';
import { Exercise, ExerciseDto } from 'app/domain';

@Injectable({
  providedIn: 'root',
})
export class ExerciseService {
  private readonly _httpClient = inject(HttpClient);
  private _api: string = environment.BACKEND_API + '/exercises/';

  constructor() {}

  fetchExercises(params?: any): Observable<Exercise[]> {
    return this._httpClient.get<Exercise[]>(this._api, { params }).pipe(
      catchError(() => {
        return throwError(() => new Error('Error getting exercises'));
      }),
    );
  }

  showExercise(id: number): Observable<Exercise> {
    return this._httpClient.get<Exercise>(this._api + `${id}/`).pipe(
      catchError(() => {
        return throwError(() => new Error('Error getting exercise'));
      }),
    );
  }

  saveExercise(body: FormData): Observable<Exercise> {
    return this._httpClient.post<Exercise>(this._api, body).pipe(
      catchError(() => {
        return throwError(() => new Error('Error saving exercise'));
      }),
    );
  }

  updateExercise(id: number, body: FormData): Observable<Exercise> {
    return this._httpClient.put<Exercise>(this._api + `${id}/`, body).pipe(
      catchError(() => {
        return throwError(() => new Error('Error updating exercise'));
      }),
    );
  }

  deleteExercise(id: number) {
    return this._httpClient.delete(this._api + `${id}/`).pipe(
      catchError(() => {
        return throwError(() => new Error('Error deleting exercise'));
      }),
    );
  }
}
