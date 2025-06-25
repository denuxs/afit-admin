import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-prime-select',
  standalone: true,
  imports: [ReactiveFormsModule, SelectModule],
  templateUrl: './prime-select.component.html',
  styleUrl: './prime-select.component.scss',
})
export class PrimeSelectComponent {
  @Input() form!: FormGroup;
  @Input() label!: string;
  @Input() controlName!: string;
  @Input() placeholder = '';
  @Input() filter = false;

  @Input() options!: any;
}
