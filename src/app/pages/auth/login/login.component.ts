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

import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';

import { AuthService } from 'app/core/auth/auth.service';
import { UserService } from 'app/services';
import { User } from 'app/domain';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, Toast, InputTextModule, PasswordModule],
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
  private readonly _userService = inject(UserService);

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
        next: (response) => {
          this.getUser();
        },
        error: (err) => {
          this.loginForm.reset();
          this._messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Usuario o contraseña incorrectos',
            life: 3000,
          });
        },
      });
  }

  getUser() {
    this._userService.profile().subscribe({
      next: (user: User) => {
        if (!user.is_superuser) {
          this._messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Usuario no autorizado',
            life: 3000,
          });
          return;
        }

        this._router.navigateByUrl('/admin');
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  checkErrors(field: string): string {
    const form: any = this.loginForm.get(field);

    if (form.invalid && (form.dirty || form.touched)) {
      if (form?.hasError('required')) {
        return 'Campo requerido';
      }
    }
    return '';
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
