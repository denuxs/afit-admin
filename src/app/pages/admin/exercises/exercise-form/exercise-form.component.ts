import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

import { Catalog, CatalogList, Exercise } from 'app/domain';
import { CatalogService } from 'app/services';

import { SelectModule } from 'primeng/select';
import { EditorModule } from 'primeng/editor';
import { InputTextModule } from 'primeng/inputtext';

import { FileUploadComponent } from 'app/components/file-upload/file-upload.component';
import { ExerciseCommentsComponent } from '../exercise-comments/exercise-comments.component';
import { FormFieldComponent } from 'app/components/form-field/form-field.component';
import { SelectInputComponent } from 'app/components/select-input/select-input.component';
@Component({
  selector: 'app-exercise-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    EditorModule,
    SelectModule,
    FileUploadComponent,
    InputTextModule,
    ExerciseCommentsComponent,
    FormFieldComponent,
    SelectInputComponent,
  ],
  templateUrl: './exercise-form.component.html',
  styleUrl: './exercise-form.component.scss',
})
export class ExerciseFormComponent implements OnInit, OnDestroy {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _sanitizer = inject(DomSanitizer);

  private readonly _catalogService = inject(CatalogService);

  private readonly _unsubscribeAll: Subject<any> = new Subject<any>();

  exerciseForm: FormGroup;

  muscles!: Catalog[];
  equipments!: Catalog[];

  exerciseId = 0;
  photoField!: File;

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

  @Input() exercise: Exercise | null = null;
  @Output() formChange: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
    this.exerciseForm = this._formBuilder.group({
      name: ['', [Validators.required]],
      description: [''],
      equipment: ['', [Validators.required]],
      muscle: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.fetchCatalogs();

    if (this.exercise) {
      const { name, description, equipment, muscle } = this.exercise;

      const form = {
        name,
        description,
        equipment: equipment.id,
        muscle: muscle.id,
      };

      this.exerciseForm.patchValue(form);
    }
  }

  fetchCatalogs(): void {
    const params = {
      ordering: '-id',
    };
    this._catalogService.fetchCatalogs(params).subscribe({
      next: (catalogs: CatalogList) => {
        const { results } = catalogs;
        this.muscles = results.filter(catalog => catalog.key === 'muscle');
        this.equipments = results.filter(
          catalog => catalog.key === 'equipment'
        );
      },
    });
  }

  handleSubmit(): void {
    if (this.exerciseForm.invalid) {
      this.exerciseForm.markAllAsTouched();
      return;
    }

    const { name, description, equipment, muscle } = this.exerciseForm.value;

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('equipment', equipment);
    formData.append('muscle', muscle);

    if (this.photoField) {
      formData.append('image', this.photoField);
    }

    this.formChange.emit(formData);
  }

  byPassHTML(html: string) {
    return this._sanitizer.bypassSecurityTrustHtml(html);
  }

  onUploadImage(file: File): void {
    this.photoField = file;
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
