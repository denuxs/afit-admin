import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Comment, Exercise, ExerciseList } from 'app/domain';

@Injectable({
  providedIn: 'root',
})
export class ExerciseService {
  private readonly _httpClient = inject(HttpClient);
  private _api: string = environment.BACKEND_API + '/exercises/';

  all(params?: any): Observable<Exercise[]> {
    return this._httpClient.get<Exercise[]>(this._api, { params });
  }

  search(params?: any): Observable<ExerciseList> {
    return this._httpClient.get<ExerciseList>(this._api, { params });
  }

  get(id: number): Observable<Exercise> {
    return this._httpClient.get<Exercise>(this._api + `${id}/`);
  }

  create(body: FormData): Observable<Exercise> {
    return this._httpClient.post<Exercise>(this._api, body);
  }

  update(id: number, body: FormData): Observable<Exercise> {
    return this._httpClient.put<Exercise>(this._api + `${id}/`, body);
  }

  delete(id: number) {
    return this._httpClient.delete(this._api + `${id}/`);
  }

  // details
  fetchComments(exerciseId: number): Observable<Comment[]> {
    return this._httpClient.get<Comment[]>(
      this._api + `${exerciseId}/comments/`
    );
  }
}
