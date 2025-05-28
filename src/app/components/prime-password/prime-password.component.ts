import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-prime-password',
  standalone: true,
  imports: [ReactiveFormsModule, PasswordModule],
  templateUrl: './prime-password.component.html',
  styleUrl: './prime-password.component.scss',
})
export class PrimePasswordComponent {
  @Input() form!: FormGroup;
  @Input() controlName!: string;
  @Input() label!: string;
  @Input() placeholder = '';
}
