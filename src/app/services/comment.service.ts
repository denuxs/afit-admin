import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Comment, CommentDto } from 'app/interfaces';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private readonly _httpClient = inject(HttpClient);
  private _api: string = environment.BACKEND_API + '/comments/';

  constructor() {}

  fetchComments(params: {
    search?: string;
    ordering?: string;
    user?: number;
    content_type?: number;
  }): Observable<Comment[]> {
    return this._httpClient.get<Comment[]>(this._api, { params });
  }

  saveComment(comment: CommentDto): Observable<Comment> {
    return this._httpClient.post<Comment>(this._api, comment);
  }

  deleteComment(id: number): Observable<void> {
    return this._httpClient.delete<void>(`${this._api}${id}/`);
  }
}
