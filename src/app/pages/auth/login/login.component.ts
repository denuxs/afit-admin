import { Component, inject, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { AuthService } from 'app/core/auth/auth.service';

import { TranslocoService } from '@jsverse/transloco';
import { ToastMessageService } from 'app/core/services/toast-message.service';

import { Toast } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { PrimeInputComponent, PrimePasswordComponent } from 'app/components';
import { UserService } from 'app/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    Toast,
    ReactiveFormsModule,
    PrimeInputComponent,
    PrimePasswordComponent,
    ButtonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnDestroy {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _router = inject(Router);

  private readonly _translocoService = inject(TranslocoService);

  private readonly _authService = inject(AuthService);
  private readonly _userService = inject(UserService);
  private readonly _toastMessage = inject(ToastMessageService);

  private readonly _unsubscribeAll: Subject<any> = new Subject<any>();

  loading = false;

  ROLES = ['admin'];

  loginForm: FormGroup = this._formBuilder.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  handleSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.loginForm.disable();
    this.loading = true;

    const { email, password } = this.loginForm.value;

    this._authService
      .loginWithFirebase(email, password)
      .then(() => {
        this.loading = false;
        this.loginForm.enable();
        this._router.navigateByUrl('admin');
      })
      .catch(() => {
        this.loading = false;
        this.loginForm.enable();
        this.showToast('login.error');
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
