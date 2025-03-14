import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

import { environment } from '../../environments/environment';
import { Post } from 'app/domain';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private readonly _httpClient = inject(HttpClient);
  private _api: string = environment.BACKEND_API + '/posts/';

  constructor() {}

  fetchPosts(params?: any): Observable<Post[]> {
    return this._httpClient.get<Post[]>(this._api, { params }).pipe(
      catchError(() => {
        return throwError(() => new Error('Error getting posts'));
      }),
    );
  }

  showPost(id: number): Observable<Post> {
    return this._httpClient.get<Post>(this._api + `${id}/`).pipe(
      catchError(() => {
        return throwError(() => new Error('Error getting post'));
      }),
    );
  }

  deletePost(id: number): Observable<Post> {
    return this._httpClient.delete<Post>(this._api + `${id}/`).pipe(
      catchError(() => {
        return throwError(() => new Error('Error deleting post'));
      }),
    );
  }

  savePhoto(form: FormData): Observable<Post> {
    return this._httpClient.post<Post>(this._api, form).pipe(
      catchError(() => {
        return throwError(() => new Error('Error saving post'));
      }),
    );
  }
}
