import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { CheckboxModule } from 'primeng/checkbox';
@Component({
  selector: 'app-prime-checkbox',
  standalone: true,
  imports: [ReactiveFormsModule, CheckboxModule],
  templateUrl: './prime-checkbox.component.html',
  styleUrl: './prime-checkbox.component.scss',
})
export class PrimeCheckboxComponent {
  @Input() form!: FormGroup;
  @Input() controlName!: string;
  @Input() label!: string;
}
