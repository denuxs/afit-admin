import { inject, Injectable } from '@angular/core';

import { environment } from 'environments/environment';
import {
  Auth,
  authState,
  signOut,
  User,
  getIdToken,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _authService: Auth = inject(Auth);

  // user$ = user(this._authService);
  authState$ = authState(this._authService);

  private readonly _api: string = environment.BACKEND_API + '/';

  createWithFirebase(email: string, password: string) {
    return createUserWithEmailAndPassword(this._authService, email, password);
  }

  loginWithFirebase(email: string, password: string) {
    return signInWithEmailAndPassword(this._authService, email, password);
  }

  logout() {
    return signOut(this._authService);
  }

  getAuthState() {
    return this.authState$;
  }

  getUser() {
    return this._authService.currentUser;
  }

  async getToken(): Promise<string | null> {
    const user = this._authService.currentUser;
    return user ? getIdToken(user, true) : null;
  }
}
