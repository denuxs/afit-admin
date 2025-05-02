import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-select-input',
  standalone: true,
  imports: [ReactiveFormsModule, SelectModule],
  templateUrl: './select-input.component.html',
  styleUrl: './select-input.component.scss',
})
export class SelectInputComponent {
  @Input() form!: FormGroup;
  @Input() label!: string;
  @Input() controlName!: string;
  @Input() placeholder = '';

  @Input() options!: any;
}
