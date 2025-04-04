import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

import { environment } from '../../environments/environment';
import { Routine, RoutineDto } from 'app/domain';

@Injectable({
  providedIn: 'root',
})
export class RoutineService {
  private readonly _httpClient = inject(HttpClient);
  private _api: string = environment.BACKEND_API + '/routines/';

  constructor() {}

  fetchRoutines(): Observable<Routine[]> {
    return this._httpClient.get<Routine[]>(this._api).pipe(
      catchError(() => {
        return throwError(() => new Error('Error getting routines'));
      }),
    );
  }

  showRoutine(id: number): Observable<Routine> {
    return this._httpClient.get<Routine>(`${this._api}${id}/`).pipe(
      catchError(() => {
        return throwError(() => new Error('Error getting routines'));
      }),
    );
  }

  saveRoutine(form: RoutineDto): Observable<Routine> {
    return this._httpClient.post<Routine>(this._api, form).pipe(
      catchError(() => {
        return throwError(() => new Error('Error saving routine'));
      }),
    );
  }

  updateRoutine(id: number, form: RoutineDto): Observable<Routine> {
    return this._httpClient.put<Routine>(this._api + `${id}/`, form).pipe(
      catchError(() => {
        return throwError(() => new Error('Error updating routine'));
      }),
    );
  }
}
