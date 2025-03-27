import { Component, inject, OnInit } from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  UntypedFormBuilder,
  Validators,
} from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { AuthService } from 'app/core/auth/auth.service';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, Toast, InputTextModule, PasswordModule],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  private readonly _router = inject(Router);
  private readonly _formBuilder = inject(FormBuilder);

  private readonly _unsubscribeAll: Subject<any> = new Subject<any>();
  private readonly _messageService = inject(MessageService);

  private readonly _authService = inject(AuthService);

  loginForm: FormGroup;

  constructor() {
    this.loginForm = this._formBuilder.group({
      username: ['admin', [Validators.required]],
      password: ['endurance', [Validators.required]],
    });
  }

  ngOnInit(): void {}

  handleSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { username, password } = this.loginForm.value;

    this.login({ username, password });
  }

  login(form: { username: string; password: string }) {
    this._authService
      .login(form)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: () => {
          this._router.navigateByUrl('/admin');
        },
        error: (err) => {
          this._messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Usuario o contraseña incorrectos',
            life: 3000,
          });
          console.log(err);
        },
      });
  }

  checkErrors(field: string): string {
    const form: any = this.loginForm.get(field);

    if (form.invalid && (form.dirty || form.touched)) {
      if (form?.hasError('required')) {
        return 'Value is required';
      }

      // if (form?.hasError('email')) {
      //   return 'Value is invalid';
      // }
    }
    return '';
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
