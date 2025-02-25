import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, map, throwError } from 'rxjs';

import { LoginDto, LoginResponse, RegisterDto, User } from 'app/domain';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _httpClient = inject(HttpClient);
  private readonly _api: string = environment.BACKEND_API + '/auth/';

  _authenticated: boolean = false;

  constructor() {}

  set accessToken(token: string) {
    localStorage.setItem('accessToken', token);
  }

  get accessToken(): string {
    return localStorage.getItem('accessToken') ?? '';
  }

  set refreshToken(token: string) {
    localStorage.setItem('refreshToken', token);
  }

  get refreshToken(): string {
    return localStorage.getItem('refreshToken') ?? '';
  }

  login(form: LoginDto): Observable<LoginResponse> {
    return this._httpClient
      .post<LoginResponse>(this._api + 'token/', form)
      .pipe(
        map((response: LoginResponse) => {
          const { access, refresh } = response;
          this.accessToken = access;
          this.refreshToken = refresh;

          this._authenticated = true;
          return response;
        }),
      );
  }

  register(form: RegisterDto): Observable<User> {
    return this._httpClient
      .post<User>(this._api + 'register/', form)
      .pipe(catchError(this.handleError));
  }

  private handleError(err: HttpErrorResponse) {
    const { error, status } = err;

    // if (!environment.production) {
    //   console.log(err);
    // }

    if (status == 400) {
      return throwError(() => error);
    }

    return throwError(() => err);
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  check(): boolean {
    if (this._authenticated) {
      return true;
    }

    if (!this.accessToken) {
      return false;
    }

    return true;
  }
}
