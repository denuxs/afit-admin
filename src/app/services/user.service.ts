import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject, tap } from 'rxjs';

import { environment } from 'environments/environment';
import { User } from 'app/domain';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly _httpClient = inject(HttpClient);
  private _api: string = environment.BACKEND_API + '/users/';

  private readonly _user: ReplaySubject<User> = new ReplaySubject<User>(1);

  set user(value: User) {
    this._user.next(value);
  }

  get user$(): Observable<User> {
    return this._user.asObservable();
  }

  profile(): Observable<User> {
    return this._httpClient.get<User>(this._api + 'me/').pipe(
      tap((user: User) => {
        this._user.next(user);
      }),
    );
  }

  getUsers(params: { search: string }): Observable<User[]> {
    return this._httpClient.get<User[]>(this._api, { params });
  }

  getUser(userId: number): Observable<User> {
    return this._httpClient.get<User>(this._api + `${userId}/`);
  }

  saveUser(form: FormData): Observable<User> {
    return this._httpClient.post<User>(this._api, form);
  }

  updateUser(id: number, form: FormData): Observable<User> {
    return this._httpClient.put<User>(this._api + `${id}/`, form);
  }
}
