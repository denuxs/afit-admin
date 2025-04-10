import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { LoginDto, LoginResponse } from 'app/domain';
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
        tap((response: LoginResponse) => {
          const { access, refresh } = response;
          this.accessToken = access;
          this.refreshToken = refresh;
          this._authenticated = true;
        }),
      );
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
