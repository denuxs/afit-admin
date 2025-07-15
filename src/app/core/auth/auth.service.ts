import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { LoginDto, LoginResponse } from 'app/interfaces';
import { environment } from 'environments/environment';
import { UserService } from 'app/services';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _httpClient = inject(HttpClient);
  private readonly _userService = inject(UserService);

  private readonly _api: string = environment.BACKEND_API + '/auth/token/';

  _authenticated = false;

  constructor() {}

  set accessToken(token: string) {
    localStorage.setItem('aafittok', token);
  }

  get accessToken(): string {
    return localStorage.getItem('aafittok') ?? '';
  }

  set refreshToken(token: string) {
    localStorage.setItem('arfittok', token);
  }

  get refreshToken(): string {
    return localStorage.getItem('arfittok') ?? '';
  }

  login(form: LoginDto): Observable<LoginResponse> {
    return this._httpClient.post<LoginResponse>(this._api, form).pipe(
      tap((response: LoginResponse) => {
        const { access, refresh, user } = response;

        if (user.role == 'admin') {
          this.accessToken = access;
          this.refreshToken = refresh;
          this._userService.user = user;
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('aafittok');
    localStorage.removeItem('arfittok');
    this._authenticated = false;
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
