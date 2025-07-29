import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ButtonModule } from 'primeng/button';

import { PrimeInputComponent, PrimePasswordComponent } from 'app/components';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    PrimeInputComponent,
    PrimePasswordComponent,
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
})
export class LoginFormComponent {
  private readonly _formBuilder = inject(FormBuilder);

  @Output() formChanged: EventEmitter<any> = new EventEmitter<any>();

  @Input() loading = false;

  loginForm: FormGroup = this._formBuilder.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  handleSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const form = this.loginForm.value;

    this.formChanged.emit(form);
  }
}
