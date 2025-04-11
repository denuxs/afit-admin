import { Component, EventEmitter, inject, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { TranslocoDirective } from '@jsverse/transloco';

interface LoginForm {
  username: string;
  password: string;
}

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    TranslocoDirective,
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
})
export class LoginFormComponent {
  private readonly _formBuilder = inject(FormBuilder);

  @Output() formChange: EventEmitter<LoginForm> = new EventEmitter<LoginForm>();

  loginForm: FormGroup;

  constructor() {
    this.loginForm = this._formBuilder.group({
      username: ['admin', [Validators.required]],
      password: ['endurance', [Validators.required]],
    });
  }

  handleSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { username, password } = this.loginForm.value;

    this.formChange.emit({ username, password });
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
}
