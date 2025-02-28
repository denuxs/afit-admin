import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

import { environment } from '../../environments/environment';
import { Equipment, EquipmentDto } from 'app/domain';

@Injectable({
  providedIn: 'root',
})
export class EquipmentService {
  private readonly _httpClient = inject(HttpClient);
  private _api: string = environment.BACKEND_API + '/equipments/';

  constructor() {}

  fetchEquipments(): Observable<Equipment[]> {
    return this._httpClient.get<Equipment[]>(this._api).pipe(
      catchError(() => {
        return throwError(() => new Error('Error getting equipments'));
      }),
    );
  }

  showEquipment(id: number): Observable<Equipment> {
    return this._httpClient.get<Equipment>(this._api + `${id}/`).pipe(
      catchError(() => {
        return throwError(() => new Error('Error getting equipment'));
      }),
    );
  }

  saveEquipment(form: EquipmentDto): Observable<Equipment> {
    return this._httpClient.post<Equipment>(this._api, form).pipe(
      catchError(() => {
        return throwError(() => new Error('Error saving equipment'));
      }),
    );
  }

  updateEquipment(id: number, form: EquipmentDto): Observable<Equipment> {
    return this._httpClient.put<Equipment>(this._api + `${id}/`, form).pipe(
      catchError(() => {
        return throwError(() => new Error('Error updating equipment'));
      }),
    );
  }
}
