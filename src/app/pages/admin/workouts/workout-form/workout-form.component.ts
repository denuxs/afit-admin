import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormArray,
  FormGroup,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map, Observable, Subject, takeUntil } from 'rxjs';

import {
  DialogService,
  DynamicDialogComponent,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { CheckboxModule } from 'primeng/checkbox';

import { PrimeInputComponent } from 'app/components/prime-input/prime-input.component';
import {
  ClientService,
  RoutineService,
  UserService,
  WorkoutService,
} from 'app/services';
import { PrimeEditorComponent } from 'app/components/prime-editor/prime-editor.component';

import { Client, Routine, User, Workout } from 'app/domain';
import { SelectModule } from 'primeng/select';
import { PrimeSelectComponent } from 'app/components/prime-select/prime-select.component';

@Component({
  selector: 'app-workout-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    PrimeInputComponent,
    SelectModule,
    PrimeEditorComponent,
    RouterLink,
    CheckboxModule,
    PrimeSelectComponent,
  ],
  templateUrl: './workout-form.component.html',
  styleUrl: './workout-form.component.scss',
})
export class WorkoutFormComponent implements OnInit, OnDestroy {
  private readonly _route = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _formBuilder = inject(UntypedFormBuilder);

  private readonly _workoutService = inject(WorkoutService);
  private readonly _routineService = inject(RoutineService);
  private readonly _clientService = inject(ClientService);

  private readonly _unsubscribeAll: Subject<any> = new Subject<any>();

  workoutForm!: UntypedFormGroup;
  workout!: Workout;
  clients!: Client[];
  routines$!: Observable<Routine[]>;

  routineList: Routine[] = [];
  title = 'Crear Rutina';

  constructor() {
    this.workoutForm = this._formBuilder.group({
      title: ['', [Validators.required]],
      description: ['', []],
      client: ['', [Validators.required]],
      // user: ['', []],
      is_active: [true, []],
      routines: this._formBuilder.array([]),
    });
  }

  ngOnInit(): void {
    this.getRoutines();
    this.getClients();

    const workoutId = this.getWorkoutId();
    if (workoutId) {
      this.title = 'Editar Rutina';
      this.getWorkout(Number(workoutId));
    }
  }

  getWorkout(workoutId: number) {
    this._workoutService
      .get(workoutId)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (workout: Workout) => {
          this.workout = workout;

          this.setFormValue(workout);
        },
      });
  }

  setFormValue(workout: Workout) {
    const { routines } = workout;

    const form = {
      title: workout.title,
      description: workout.description,
      client: workout.client.id,
      // user: workout.user,
      is_active: workout.is_active,
    };

    this.workoutForm.patchValue(form);
    this.setRoutines(routines);
  }

  getWorkoutId() {
    return this._route.snapshot.paramMap.get('id');
  }

  getRoutines() {
    const params = {
      ordering: '-id',
      paginator: null,
    };

    this._routineService
      .all(params)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (routine: Routine[]) => {
          this.routineList = routine;
        },
      });
  }

  getClients() {
    const params = {
      ordering: '-id',
      paginator: null,
    };

    this._clientService
      .all(params)
      .pipe(
        takeUntil(this._unsubscribeAll),
        map((response: Client[]) => {
          return response.map(client => {
            return { id: client.id, name: client.fullname };
          });
        })
      )
      .subscribe({
        next: (clients: any) => {
          this.clients = clients;
        },
      });
  }

  get routines(): FormArray {
    return this.workoutForm.get('routines') as FormArray;
  }

  setRoutines(data: any) {
    const formGroups: any = [];
    data.forEach((item: any) => {
      const { id } = item;

      formGroups.push(
        this._formBuilder.group({
          routine: [item.id],
        })
      );
    });

    formGroups.forEach((item: any) => {
      this.routines.push(item);
    });
  }

  addRoutine(): void {
    const formGroup: FormGroup = this._formBuilder.group({
      routine: ['', Validators.required],
    });

    this.routines.push(formGroup);
  }

  removeRoutine(index: number): void {
    this.routines.removeAt(index);
  }

  handleSubmit(): void {
    if (this.workoutForm.invalid) {
      this.workoutForm.markAllAsTouched();
      return;
    }

    const { title, description, client, routines } = this.workoutForm.value;
    const routineIds = routines.map((obj: any) => obj.routine);

    const form = {
      title,
      description,
      client,
      routines: routineIds,
    };

    if (this.workout) {
      this.updateWorkout(this.workout.id, form);
      return;
    }

    this.createWorkout(form);
  }

  createWorkout(form: any) {
    this._workoutService
      .create(form)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: () => {
          const url = `/admin/workouts`;
          this._router.navigateByUrl(url);
        },
        error: errors => this.setFormErrors(errors),
      });
  }

  updateWorkout(id: number, form: any) {
    this._workoutService
      .update(id, form)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: () => {
          const url = `/admin/workouts`;
          this._router.navigateByUrl(url);
        },
        error: errors => this.setFormErrors(errors),
      });
  }

  setFormErrors(errors: any) {
    for (const field in errors) {
      if (this.workoutForm.controls[field]) {
        const control = this.workoutForm.get(field);
        control?.setErrors({ server: errors[field].join(' ') });
      }
    }

    this.workoutForm.markAllAsTouched();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
