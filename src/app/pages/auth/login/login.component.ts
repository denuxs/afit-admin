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
import { LoginDto } from 'app/domain';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  private readonly _router = inject(Router);
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _unsubscribeAll: Subject<any> = new Subject<any>();

  private readonly _authService = inject(AuthService);

  loginForm: FormGroup;
  unauthenticated: boolean = true;

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

    const form: LoginDto = {
      username,
      password,
    };

    this._authService
      .login(form)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: () => {
          this._router.navigateByUrl('/admin');
        },
        error: (err) => {
          this.unauthenticated = false;
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
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
