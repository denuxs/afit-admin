import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject, tap } from 'rxjs';

import { environment } from 'environments/environment';
import { Client, User, UserList } from 'app/interfaces';

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
      })
    );
  }

  all(params?: any): Observable<User[]> {
    return this._httpClient.get<User[]>(this._api, { params });
  }

  search(params?: any): Observable<UserList> {
    return this._httpClient.get<UserList>(this._api, { params });
  }

  get(userId: number): Observable<User> {
    return this._httpClient.get<User>(this._api + `${userId}/`);
  }

  create(form: FormData): Observable<User> {
    return this._httpClient.post<User>(this._api, form);
  }

  update(id: number, form: FormData): Observable<User> {
    return this._httpClient.put<User>(this._api + `${id}/`, form);
  }

  delete(id: number): Observable<User> {
    return this._httpClient.delete<User>(this._api + `${id}/`);
  }

  clients(): Observable<Client[]> {
    return this._httpClient.get<Client[]>(this._api + 'clients/');
  }

  routines(userId: number): Observable<any> {
    return this._httpClient.get<any>(this._api + `${userId}/routines/`);
  }

  saveFirebaseToken(form: {
    token: string;
    user: number;
    device: string;
  }): Observable<User> {
    return this._httpClient.post<User>(
      environment.BACKEND_API + '/fcmtokens/',
      form
    );
  }
}
