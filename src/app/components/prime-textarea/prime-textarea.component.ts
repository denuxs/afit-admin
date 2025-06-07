import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
@Component({
  selector: 'app-prime-textarea',
  standalone: true,
  imports: [ReactiveFormsModule, TextareaModule],
  templateUrl: './prime-textarea.component.html',
  styleUrl: './prime-textarea.component.scss',
})
export class PrimeTextareaComponent {
  @Input() form!: FormGroup;
  @Input() controlName!: string;
  @Input() label!: string;
  @Input() placeholder = '';
  @Input() help = '';
}
