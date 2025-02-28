import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  UntypedFormArray,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';

import { Routine, User, WorkoutDto } from 'app/domain';
import { RoutineService, UserService, WorkoutService } from 'app/services';
import { AsyncPipe } from '@angular/common';
import { FormControlPipe } from 'app/pipes/form-control.pipe';

@Component({
  selector: 'app-workout-form',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe, FormControlPipe],
  templateUrl: './workout-form.component.html',
  styleUrl: './workout-form.component.scss',
})
export class WorkoutFormComponent implements OnInit {
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  private readonly _formBuilder = inject(FormBuilder);

  private readonly _workoutService = inject(WorkoutService);
  private readonly _routineService = inject(RoutineService);
  private readonly _userService = inject(UserService);
  private readonly _unsubscribeAll: Subject<any> = new Subject<any>();

  workoutForm!: FormGroup;
  users$!: Observable<User[]>;
  routines$!: Observable<Routine[]>;

  workoutId: number = 0;

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
    this.workoutForm = this._formBuilder.group({
      name: ['', [Validators.required]],
      user: ['', [Validators.required]],
      day: ['', [Validators.required]],
      routines: this._formBuilder.array([]),
    });
  }

  ngOnInit(): void {
    this.getUsers();
    this.getRoutines();

    const workoutId = this._route.snapshot.paramMap.get('id');
    if (workoutId) {
      this.workoutId = +workoutId;
      this.getWorkout(+workoutId);
    }
  }

  getUsers(): void {
    this.users$ = this._userService.getUsers();
  }

  getRoutines() {
    this.routines$ = this._routineService.fetchRoutines();
  }

  getWorkout(workoutId: number) {
    this._workoutService
      .showWorkout(workoutId)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: any) => {
          const form = {
            name: response.name,
            user: response.user.id,
            day: response.day,
          };
          this.workoutForm.patchValue(form);

          this.setRoutines(response.routines);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  handleSubmit(): void {
    if (this.workoutForm.invalid) {
      this.workoutForm.markAllAsTouched();
      return;
    }

    const { name, user, day, routines } = this.workoutForm.value;
    const routineIds = routines.map((item: any) => item.id);

    const form: WorkoutDto = {
      name,
      user,
      day,
      routines: routineIds,
    };

    if (this.workoutId) {
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
          this._router.navigateByUrl('/admin/workouts');
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  update(form: WorkoutDto) {
    this._workoutService
      .updateWorkout(this.workoutId, form)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: () => {
          this._router.navigateByUrl('/admin/workouts');
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  checkErrors(field: string): string {
    const form: any = this.workoutForm.get(field);

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

  // routines form array

  get routines(): UntypedFormArray {
    return this.workoutForm.get('routines') as UntypedFormArray;
  }

  setRoutines(data: any) {
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
      this.routines.push(item);
    });
  }

  addRoutine(): void {
    const formGroup = this._formBuilder.group({
      id: ['', [Validators.required]],
    });

    this.routines.push(formGroup);
  }

  removeRoutine(index: number): void {
    this.routines.removeAt(index);
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
