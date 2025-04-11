import { Component, inject, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { Toast } from 'primeng/toast';

import { AuthService } from 'app/core/auth/auth.service';
import { UserService } from 'app/services';
import { User } from 'app/domain';
import { LoginFormComponent } from './login-form/login-form.component';

import { TranslocoService } from '@jsverse/transloco';
import { ToastMessageService } from 'app/core/services/toast-message.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [Toast, LoginFormComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  private readonly _router = inject(Router);

  private readonly _translocoService = inject(TranslocoService);

  private readonly _authService = inject(AuthService);
  private readonly _userService = inject(UserService);
  private readonly _toastMessage = inject(ToastMessageService);

  private readonly _unsubscribeAll: Subject<any> = new Subject<any>();

  ngOnInit(): void {}

  onFormChange(form: { username: string; password: string }) {
    this._authService
      .login(form)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: any) => {
          const { user } = response;
          if (!user.is_superuser) {
            this.showToast('login.unauthorized');
            return;
          }

          this._router.navigateByUrl('/admin');
        },
        error: (err) => {
          this.showToast('login.error');
        },
      });
  }

  showToast(key: string) {
    const translate = this._translocoService.translate(key);
    this._toastMessage.sendMessage(translate);
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
