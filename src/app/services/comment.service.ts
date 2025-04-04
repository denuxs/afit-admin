import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

import { environment } from '../../environments/environment';
import { Comment, CommentDto } from 'app/domain';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private readonly _httpClient = inject(HttpClient);
  private _api: string = environment.BACKEND_API + '/comments/';

  constructor() {}

  fetchComments(params?: any): Observable<Comment[]> {
    return this._httpClient.get<Comment[]>(this._api, { params }).pipe(
      catchError(() => {
        return throwError(() => new Error('Error getting comments'));
      }),
    );
  }

  saveComment(comment: CommentDto): Observable<Comment> {
    return this._httpClient.post<Comment>(this._api, comment).pipe(
      catchError(() => {
        return throwError(() => new Error('Error saving comment'));
      }),
    );
  }

  deleteComment(id: number): Observable<void> {
    return this._httpClient.delete<void>(`${this._api}${id}/`).pipe(
      catchError(() => {
        return throwError(() => new Error('Error deleting comment'));
      }),
    );
  }
}
