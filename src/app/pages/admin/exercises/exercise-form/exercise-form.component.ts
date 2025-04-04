import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Catalog, Exercise, ExerciseDto, User } from 'app/domain';
import { CatalogService, ExerciseService, UserService } from 'app/services';
import { Observable, Subject, takeUntil } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { SelectModule } from 'primeng/select';
import { EditorModule } from 'primeng/editor';
@Component({
  selector: 'app-exercise-form',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe, EditorModule, SelectModule],
  templateUrl: './exercise-form.component.html',
  styleUrl: './exercise-form.component.scss',
})
export class ExerciseFormComponent implements OnInit {
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  private readonly _formBuilder = inject(FormBuilder);

  private readonly _exerciseService = inject(ExerciseService);
  private readonly _catalogService = inject(CatalogService);

  private readonly _userService = inject(UserService);

  private readonly _sanitizer = inject(DomSanitizer);

  private readonly _unsubscribeAll: Subject<any> = new Subject<any>();

  exerciseForm: FormGroup;
  equipments$!: Observable<Catalog[]>;
  muscles$!: Observable<Catalog[]>;

  exerciseId: number = 0;
  user!: User;

  modules = {
    toolbar: [['bold'], [{ list: 'ordered' }, { list: 'bullet' }]],
  };

  photoPreview: string = 'https://placehold.co/200x160';
  photoField!: File;

  constructor() {
    this.exerciseForm = this._formBuilder.group({
      name: ['', [Validators.required]],
      description: [''],
      equipment: ['', []],
      muscle: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getEquipments();
    this.getMuscles();
    this.getUser();

    const exerciseId = this._route.snapshot.paramMap.get('id');
    if (exerciseId) {
      this.exerciseId = +exerciseId;
      this.getExercise(+exerciseId);
    }
  }

  getExercise(exerciseId: number) {
    this._exerciseService
      .showExercise(exerciseId)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: Exercise) => {
          const form = {
            name: response.name,
            description: response.description,
            equipment: response.equipment?.id,
            muscle: response.muscle.id,
          };
          this.exerciseForm.patchValue(form);
          this.photoPreview = response.image;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  getUser() {
    this._userService.user$.subscribe({
      next: (response: User) => {
        this.user = response;
      },
      error: (err) => {
        console.log('error getting user');
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

    if (this.exerciseId) {
      this.update(formData);
    } else {
      this.save(formData);
    }
  }

  save(form: FormData) {
    this._exerciseService
      .saveExercise(form)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: () => {
          this._router.navigateByUrl('/admin/exercises');
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  update(form: FormData) {
    this._exerciseService
      .updateExercise(this.exerciseId, form)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: () => {
          this._router.navigateByUrl('/admin/exercises');
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  checkErrors(field: string): string {
    const form: any = this.exerciseForm.get(field);

    if (form.invalid && (form.dirty || form.touched)) {
      if (form?.hasError('required')) {
        return 'Value is required';
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

  uploadImage(event: any): void {
    const file: File = event.target.files[0];
    if (!file) {
      return;
    }

    this.photoField = file;

    this._readAsDataURL(file).then((data) => {
      this.photoPreview = data;
    });
  }

  private _readAsDataURL(file: File): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (): void => {
        resolve(reader.result);
      };

      reader.onerror = (e): void => {
        reject(e);
      };

      reader.readAsDataURL(file);
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
