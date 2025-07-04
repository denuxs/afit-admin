import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'app-prime-input',
  standalone: true,
  imports: [ReactiveFormsModule, TranslocoDirective, InputTextModule],
  templateUrl: './prime-input.component.html',
  styleUrl: './prime-input.component.scss',
})
export class PrimeInputComponent {
  @Input() form!: FormGroup;
  @Input() controlName!: string;
  @Input() label!: string;
  @Input() placeholder = '';
  @Input() help = '';
}
