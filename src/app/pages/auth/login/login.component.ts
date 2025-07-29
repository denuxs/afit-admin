import { Component, inject, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { AuthService } from 'app/core/auth/auth.service';

import { TranslocoService } from '@jsverse/transloco';
import { ToastMessageService } from 'app/core/services/toast-message.service';

import { Toast } from 'primeng/toast';
import { LoginFormComponent } from './components/login-form/login-form.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [Toast, LoginFormComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnDestroy {
  private readonly _router = inject(Router);

  private readonly _translocoService = inject(TranslocoService);

  private readonly _authService = inject(AuthService);
  private readonly _toastMessage = inject(ToastMessageService);

  private readonly _unsubscribeAll: Subject<any> = new Subject<any>();

  loading = false;

  ROLES = ['admin'];

  handleSubmit($event: any) {
    const form = $event;

    this.loading = true;

    this._authService
      .login(form)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: any) => {
          const { user } = response;

          this.loading = false;
          const roles = this.ROLES;

          if (roles.includes(user.role)) {
            this._router.navigateByUrl('admin');
            return;
          }

          this.showToast('login.unauthorized');
        },
        error: () => {
          this.loading = false;
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
