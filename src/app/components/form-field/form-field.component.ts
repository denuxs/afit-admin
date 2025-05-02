import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.scss',
})
export class FormFieldComponent {
  @Input() form!: FormGroup;
  @Input() controlName!: string;
  @Input() label!: string;
  @Input() placeholder = '';
  @Input() type = 'text';
}
