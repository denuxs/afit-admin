import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';

import { LoginDto, LoginResponse } from 'app/interfaces';
import { environment } from 'environments/environment';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _httpClient = inject(HttpClient);
  private readonly _userService = inject(UserService);

  private readonly _api: string = environment.BACKEND_API + '/';

  _authenticated = false;

  set isloggedIn(value: string) {
    localStorage.setItem('isloggedIn', value);
  }

  get isloggedIn(): string {
    return localStorage.getItem('isloggedIn') ?? '';
  }

  login(form: LoginDto): Observable<LoginResponse> {
    return this._httpClient
      .post<LoginResponse>(this._api + 'login/', form)
      .pipe(
        tap((response: LoginResponse) => {
          const { user } = response;

          if (user.role == 'admin') {
            this._userService.user = user;
            this.isloggedIn = 'true';
            this._authenticated = true;
          }
        })
      );
  }

  logout() {
    localStorage.removeItem('isloggedIn');
    this._authenticated = false;
  }

  isAuthenticated(): boolean {
    return !!this.isloggedIn;
  }

  check(): Observable<boolean> {
    if (this._authenticated) {
      return of(true);
    }

    if (!this.isloggedIn) {
      return of(false);
    }

    return of(true);
  }
}
