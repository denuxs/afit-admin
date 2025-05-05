import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

import { Catalog, Exercise } from 'app/domain';
import { CatalogService, ExerciseService } from 'app/services';

import {
  DialogService,
  DynamicDialogComponent,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';

import { FileUploadComponent } from 'app/components/file-upload/file-upload.component';
import { ExerciseCommentsComponent } from '../exercise-comments/exercise-comments.component';
import { PrimeInputComponent } from 'app/components/prime-input/prime-input.component';
import { PrimeSelectComponent } from 'app/components/prime-select/prime-select.component';
import { PrimeEditorComponent } from 'app/components/prime-editor/prime-editor.component';

@Component({
  selector: 'app-exercise-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FileUploadComponent,
    ExerciseCommentsComponent,
    PrimeInputComponent,
    PrimeSelectComponent,
    PrimeEditorComponent,
  ],
  providers: [DialogService, MessageService],
  templateUrl: './exercise-form.component.html',
  styleUrl: './exercise-form.component.scss',
})
export class ExerciseFormComponent implements OnInit, OnDestroy {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _sanitizer = inject(DomSanitizer);
  private readonly _config = inject(DynamicDialogConfig);
  private readonly _ref = inject(DynamicDialogRef);

  private readonly _exerciseService = inject(ExerciseService);

  private readonly _unsubscribeAll: Subject<any> = new Subject<any>();

  exerciseForm: FormGroup;
  exercise!: Exercise;
  photoField!: File;
  image = 'default.jpg';

  muscles: Catalog[] = [];
  equipments: Catalog[] = [];

  constructor() {
    this.exerciseForm = this._formBuilder.group({
      name: ['', [Validators.required]],
      description: [''],
      equipment: ['', [Validators.required]],
      muscle: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    const config = this._config.data;
    const { muscles, equipments } = config;
    this.muscles = muscles;
    this.equipments = equipments;

    if ('exercise' in config) {
      const { image } = config.exercise;
      if (image) {
        this.image = image;
      }

      this.exercise = config.exercise;
      this.setFormValue(config.exercise);
    }
  }

  setFormValue(exercise: Exercise) {
    const form = {
      name: exercise.name,
      key: exercise.description,
      equipment: exercise.equipment.id,
      muscle: exercise.muscle.id,
      description: exercise.description,
    };

    this.exerciseForm.patchValue(form);
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

    if (this.exercise) {
      this.updateCatalog(this.exercise.id, formData);
      return;
    }

    this.createCatalog(formData);
  }

  createCatalog(form: FormData) {
    this._exerciseService
      .create(form)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: () => {
          this.closeDialog();
        },
        error: errors => this.setFormErrors(errors),
      });
  }

  updateCatalog(id: number, form: FormData) {
    this._exerciseService
      .update(id, form)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: () => {
          this.closeDialog();
        },
        error: errors => this.setFormErrors(errors),
      });
  }

  closeDialog() {
    this._ref.close(true);
  }

  setFormErrors(errors: any) {
    for (const field in errors) {
      if (this.exerciseForm.controls[field]) {
        const control = this.exerciseForm.get(field);
        control?.setErrors({ server: errors[field].join(' ') });
      }
    }

    this.exerciseForm.markAllAsTouched();
  }

  handleFile(file: File): void {
    this.photoField = file;
  }

  byPassHTML(html: string) {
    return this._sanitizer.bypassSecurityTrustHtml(html);
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();

    if (this._ref) {
      this._ref.close();
    }
  }
}
