import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Post } from 'app/interfaces';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private readonly _httpClient = inject(HttpClient);
  private _api: string = environment.BACKEND_API + '/posts/';

  constructor() {}

  fetchPosts(params?: any): Observable<Post[]> {
    return this._httpClient.get<Post[]>(this._api, { params });
  }

  showPost(id: number): Observable<Post> {
    return this._httpClient.get<Post>(this._api + `${id}/`);
  }

  deletePost(id: number): Observable<Post> {
    return this._httpClient.delete<Post>(this._api + `${id}/`);
  }

  savePhoto(form: FormData): Observable<Post> {
    return this._httpClient.post<Post>(this._api, form);
  }
}
