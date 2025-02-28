import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormArray,
  UntypedFormGroup,
  UntypedFormBuilder,
  UntypedFormControl,
  Validators,
  AbstractControl,
  FormControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';

import { Exercise, RoutineDto } from 'app/domain';
import { ExerciseService, RoutineService } from 'app/services';
import { AsyncPipe } from '@angular/common';
import { FormControlPipe } from 'app/pipes/form-control.pipe';
import { QuillEditorComponent } from 'ngx-quill';

@Component({
  selector: 'app-routine-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    FormControlPipe,
    QuillEditorComponent,
  ],
  templateUrl: './routine-form.component.html',
  styleUrl: './routine-form.component.scss',
})
export class RoutineFormComponent implements OnInit {
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  private readonly _formBuilder = inject(UntypedFormBuilder);

  private readonly _routineService = inject(RoutineService);
  private readonly _exerciseService = inject(ExerciseService);
  private readonly _unsubscribeAll: Subject<any> = new Subject<any>();

  routineForm!: UntypedFormGroup;
  exercises$!: Observable<Exercise[]>;

  routineId: number = 0;

  constructor() {
    this.routineForm = this._formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', []],
      exercises: this._formBuilder.array([]),
    });
  }

  ngOnInit(): void {
    this.getExercises();

    const routineId = this._route.snapshot.paramMap.get('id');
    if (routineId) {
      this.routineId = +routineId;
      this.getRoutine(+routineId);
    }
  }

  getExercises() {
    this.exercises$ = this._exerciseService.fetchExercises();
  }

  getRoutine(routineId: number) {
    this._routineService
      .showRoutine(routineId)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: any) => {
          const form = {
            name: response.name,
            description: response.description,
          };
          this.routineForm.patchValue(form);

          this.setExercises(response.exercises);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  handleSubmit(): void {
    if (this.routineForm.invalid) {
      this.routineForm.markAllAsTouched();
      return;
    }

    const { name, description, exercises } = this.routineForm.value;

    const exercisesIds = exercises.map((item: any) => item.id);

    const form: RoutineDto = {
      name,
      description,
      exercises: exercisesIds,
    };

    if (this.routineId) {
      this.update(form);
    } else {
      this.save(form);
    }
  }

  save(form: RoutineDto) {
    this._routineService
      .saveRoutine(form)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: () => {
          this._router.navigateByUrl('/admin/routines');
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  update(form: RoutineDto) {
    this._routineService
      .updateRoutine(this.routineId, form)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: () => {
          this._router.navigateByUrl('/admin/routines');
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  checkErrors(field: string): string {
    const form: any = this.routineForm.get(field);

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

  // exercises form array

  get exercises(): UntypedFormArray {
    return this.routineForm.get('exercises') as UntypedFormArray;
  }

  setExercises(data: any) {
    const formGroups: any = [];

    if (data.length > 0) {
      data.forEach((item: any) => {
        formGroups.push(
          this._formBuilder.group({
            id: [item.id],
          }),
        );
      });
    }

    formGroups.forEach((item: any) => {
      this.exercises.push(item);
    });
  }

  addExercise(): void {
    const formGroup = this._formBuilder.group({
      id: ['', [Validators.required]],
    });

    this.exercises.push(formGroup);
  }

  removeExercise(index: number): void {
    this.exercises.removeAt(index);
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
