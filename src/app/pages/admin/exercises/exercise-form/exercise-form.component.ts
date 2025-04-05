import { AsyncPipe, NgStyle } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { map, Observable, Subject, takeUntil, tap } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { forkJoin } from 'rxjs';

import { Catalog, Exercise, User } from 'app/domain';
import { CatalogService, UserService } from 'app/services';

import { SelectModule } from 'primeng/select';
import { EditorModule } from 'primeng/editor';
import { InputTextModule } from 'primeng/inputtext';

import { FileUploadComponent } from 'app/components/file-upload/file-upload.component';
@Component({
  selector: 'app-exercise-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    NgStyle,
    EditorModule,
    SelectModule,
    FileUploadComponent,
    InputTextModule,
  ],
  templateUrl: './exercise-form.component.html',
  styleUrl: './exercise-form.component.scss',
})
export class ExerciseFormComponent implements OnInit {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _sanitizer = inject(DomSanitizer);

  private readonly _catalogService = inject(CatalogService);
  private readonly _userService = inject(UserService);

  private readonly _unsubscribeAll: Subject<any> = new Subject<any>();

  exerciseForm: FormGroup;

  equipments$!: Observable<Catalog[]>;
  muscles$!: Observable<Catalog[]>;

  exerciseId: number = 0;
  photoField!: File;
  user!: User;

  modules = {
    toolbar: [['bold'], [{ list: 'ordered' }, { list: 'bullet' }]],
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

    this.getUser();
  }

  ngOnInit(): void {
    this.getEquipments();
    this.getMuscles();

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

  getUser() {
    this._userService.user$.subscribe({
      next: (response: User) => {
        this.user = response;
      },
    });
  }

  getMuscles() {
    this.muscles$ = this._catalogService.fetchCatalogs({
      key: 'muscle',
    });
  }

  getEquipments() {
    this.equipments$ = this._catalogService.fetchCatalogs({
      key: 'equipment',
    });
  }

  handleSubmit(): void {
    if (this.exerciseForm.invalid) {
      this.exerciseForm.markAllAsTouched();
      return;
    }

    const { name, description, equipment, muscle } = this.exerciseForm.value;

    const user = this.user.id;

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('equipment', equipment);
    formData.append('muscle', muscle);
    formData.append('user', user.toString());

    if (this.photoField) {
      formData.append('image', this.photoField);
    }

    this.formChange.emit(formData);
  }

  checkErrors(field: string): string {
    const form: any = this.exerciseForm.get(field);

    if (form.invalid && (form.dirty || form.touched)) {
      if (form?.hasError('required')) {
        return 'Campo requerido';
      }

      // if (form?.hasError('email')) {
      //   return 'Value is invalid';
      // }
    }
    return '';
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
