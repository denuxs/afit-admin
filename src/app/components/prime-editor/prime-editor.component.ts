import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { EditorModule } from 'primeng/editor';

import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'app-prime-editor',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    EditorModule,
    InputTextModule,
  ],
  templateUrl: './prime-editor.component.html',
  styleUrl: './prime-editor.component.scss',
})
export class PrimeEditorComponent {
  @Input() form!: FormGroup;
  @Input() controlName!: string;
  @Input() label!: string;
  @Input() placeholder = '';

  modules = {
    toolbar: [
      // [{ header: 3 }, { header: 4 }],
      [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
      [{ color: [] }, { background: [] }],
      // [{ font: [] }],
      [{ align: [] }],
      ['clean'],
    ],
  };
}
