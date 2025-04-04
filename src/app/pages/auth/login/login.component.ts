import { Component, inject, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';

import { AuthService } from 'app/core/auth/auth.service';
import { UserService } from 'app/services';
import { User } from 'app/domain';
import { LoginFormComponent } from './login-form/login-form.component';

import { TranslocoService } from '@jsverse/transloco';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [Toast, LoginFormComponent],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  private readonly _router = inject(Router);

  private readonly _unsubscribeAll: Subject<any> = new Subject<any>();
  private readonly _messageService = inject(MessageService);
  private readonly _translocoService = inject(TranslocoService);

  private readonly _authService = inject(AuthService);
  private readonly _userService = inject(UserService);

  ngOnInit(): void {}

  onFormChange(form: { username: string; password: string }) {
    this._authService
      .login(form)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response) => {
          this.getUser();
        },
        error: (err) => {
          this.showToast(this.getTransloco('login.error'));
        },
      });
  }

  getUser() {
    this._userService.profile().subscribe({
      next: (user: User) => {
        if (!user.is_superuser) {
          this.showToast(this.getTransloco('login.unauthorized'));
          return;
        }

        this._router.navigateByUrl('/admin');
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  showToast(message: string) {
    this._messageService.add({
      severity: 'error',
      summary: 'Error',
      icon: 'pi pi-exclamation-triangle',
      detail: message,
    });
  }

  getTransloco(key: string) {
    return this._translocoService.translate(key);
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
