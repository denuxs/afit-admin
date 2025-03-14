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

import {
  Exercise,
  Routine,
  RoutineDto,
  User,
  Workout,
  WorkoutDto,
} from 'app/domain';
import { ExerciseService, UserService, WorkoutService } from 'app/services';
import { AsyncPipe } from '@angular/common';
import { FormControlPipe } from 'app/pipes/form-control.pipe';
import { QuillEditorComponent } from 'ngx-quill';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-routine-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    FormControlPipe,
    QuillEditorComponent,
    SelectModule,
  ],
  templateUrl: './routine-form.component.html',
  styleUrl: './routine-form.component.scss',
})
export class RoutineFormComponent implements OnInit {
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  private readonly _formBuilder = inject(UntypedFormBuilder);

  private readonly _workoutService = inject(WorkoutService);
  private readonly _exerciseService = inject(ExerciseService);
  private readonly _userService = inject(UserService);
  private readonly _unsubscribeAll: Subject<any> = new Subject<any>();

  routineForm!: UntypedFormGroup;
  exercises$!: Observable<Exercise[]>;
  users$!: Observable<User[]>;

  routineId: number = 0;

  days = [
    { value: 1, label: 'Lunes' },
    { value: 2, label: 'Martes' },
    { value: 3, label: 'Miercoles' },
    { value: 4, label: 'Jueves' },
    { value: 5, label: 'Viernes' },
    { value: 6, label: 'Sabado' },
    { value: 7, label: 'Domingo' },
  ];

  constructor() {
    this.routineForm = this._formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', []],
      day: ['', []],
      user: ['', []],
      exercises: this._formBuilder.array([]),
    });
  }

  ngOnInit(): void {
    this.getUsers();
    this.getExercises();
    const routineId = this._route.snapshot.paramMap.get('id');
    if (routineId) {
      this.routineId = +routineId;
      this.getRoutine(+routineId);
    }
  }

  getUsers(): void {
    this.users$ = this._userService.getUsers();
  }

  getExercises() {
    this.exercises$ = this._exerciseService.fetchExercises();
  }

  getRoutine(routineId: number) {
    this._workoutService
      .showWorkout(routineId)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: Workout) => {
          const form = {
            name: response.name,
            description: response.description,
            day: response.day,
            user: response.user.id,
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

    const { name, description, day, user, exercises } = this.routineForm.value;

    const exercisesIds = exercises.map((item: any) => item.id);

    const form: WorkoutDto = {
      name,
      description,
      day,
      user,
      exercises: exercisesIds,
    };

    if (this.routineId) {
      this.update(form);
    } else {
      this.save(form);
    }
  }

  save(form: WorkoutDto) {
    this._workoutService
      .saveWorkout(form)
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

  update(form: WorkoutDto) {
    this._workoutService
      .updateWorkout(this.routineId, form)
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
