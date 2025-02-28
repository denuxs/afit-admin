import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

import { environment } from '../../environments/environment';
import { Muscle, MuscleDto } from 'app/domain';

@Injectable({
  providedIn: 'root',
})
export class MuscleService {
  private readonly _httpClient = inject(HttpClient);
  private _api: string = environment.BACKEND_API + '/muscles/';

  constructor() {}

  fetchMuscles(): Observable<Muscle[]> {
    return this._httpClient.get<Muscle[]>(this._api).pipe(
      catchError(() => {
        return throwError(() => new Error('Error getting muscles'));
      }),
    );
  }

  showMuscle(id: number): Observable<Muscle> {
    return this._httpClient.get<Muscle>(this._api + `${id}/`).pipe(
      catchError(() => {
        return throwError(() => new Error('Error getting muscle'));
      }),
    );
  }

  saveMuscle(form: MuscleDto): Observable<Muscle> {
    return this._httpClient.post<Muscle>(this._api, form).pipe(
      catchError(() => {
        return throwError(() => new Error('Error saving muscle'));
      }),
    );
  }

  updateMuscle(id: number, form: MuscleDto): Observable<Muscle> {
    return this._httpClient.put<Muscle>(this._api + `${id}/`, form).pipe(
      catchError(() => {
        return throwError(() => new Error('Error updating muscle'));
      }),
    );
  }
}
