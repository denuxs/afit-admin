import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

import { environment } from '../../environments/environment';
import { Equipment } from 'app/domain';

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
}
