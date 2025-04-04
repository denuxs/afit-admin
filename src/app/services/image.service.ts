import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

import { environment } from '../../environments/environment';
import { Image, CommentDto } from 'app/domain';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private readonly _httpClient = inject(HttpClient);
  private _api: string = environment.BACKEND_API + '/images/';

  constructor() {}

  fetchImages(params?: {
    object_id: number;
    content_type: number;
  }): Observable<Image[]> {
    return this._httpClient.get<Image[]>(this._api, { params }).pipe(
      catchError(() => {
        return throwError(() => new Error('Error getting images'));
      }),
    );
  }

  saveImage(form: FormData): Observable<Image> {
    return this._httpClient.post<Image>(this._api, form).pipe(
      catchError(() => {
        return throwError(() => new Error('Error saving image'));
      }),
    );
  }

  deleteImage(id: number): Observable<Image> {
    return this._httpClient.delete<Image>(this._api + `${id}/`).pipe(
      catchError(() => {
        return throwError(() => new Error('Error deleting image'));
      }),
    );
  }
}
