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
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';

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
    ButtonModule,
    DialogModule,
    TableModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
  ],
  templateUrl: './workout-form.component.html',
  styleUrl: './workout-form.component.scss',
})
export class WorkoutFormComponent implements OnInit, OnDestroy {
  private readonly _route = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _formBuilder = inject(UntypedFormBuilder);
  private readonly _config = inject(DynamicDialogConfig);
  private readonly _ref = inject(DynamicDialogRef);

  private readonly _workoutService = inject(WorkoutService);
  private readonly _routineService = inject(RoutineService);
  private readonly _clientService = inject(ClientService);

  private readonly _unsubscribeAll: Subject<any> = new Subject<any>();

  workoutForm!: UntypedFormGroup;
  workout!: Workout;
  clients!: Client[];
  routines$!: Observable<Routine[]>;

  routineList: Routine[] = [];

  customers = [
    {
      id: 1000,
      name: 'James Butt',
      country: {
        name: 'Algeria',
        code: 'dz',
      },
      company: 'Benton, John B Jr',
      date: '2015-09-13',
      status: 'unqualified',
      verified: true,
      activity: 17,
      representative: {
        name: 'Ioni Bowcher',
        image: 'ionibowcher.png',
      },
      balance: 70663,
    },
    {
      id: 1002,
      name: 'James Butt',
      country: {
        name: 'Algeria',
        code: 'dz',
      },
      company: 'Benton, John B Jr',
      date: '2015-09-13',
      status: 'unqualified',
      verified: true,
      activity: 17,
      representative: {
        name: 'Ioni Bowcher',
        image: 'ionibowcher.png',
      },
      balance: 70663,
    },
  ];

  dialogVisible = false;
  selectedProducts!: any;

  constructor() {
    this.workoutForm = this._formBuilder.group({
      title: ['', [Validators.required]],
      description: ['', []],
      // client: ['', [Validators.required]],
      is_active: [true, []],
      routines: this._formBuilder.array([]),
    });
  }

  ngOnInit(): void {
    this.getRoutines();

    const config = this.getConfig();

    if (config && 'workout' in config) {
      this.workout = config.workout;

      this.setFormValue(config.workout);
    }
  }

  showDialog() {
    this.dialogVisible = true;
  }

  onRowSelect(event: any) {
    // console.log(event);
  }

  okModal() {
    this.dialogVisible = false;
    this.routines.clear();

    const routines = this.selectedProducts;

    for (const item of routines) {
      const formGroup: FormGroup = this._formBuilder.group({
        routine: [{ value: item.id, disabled: true }, [Validators.required]],
      });

      this.routines.push(formGroup);
    }
  }

  getConfig() {
    return this._config.data;
  }

  setFormValue(workout: Workout) {
    const { routines } = workout;

    const form = {
      title: workout.title,
      description: workout.description,
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

  get routines(): FormArray {
    return this.workoutForm.get('routines') as FormArray;
  }

  setRoutines(data: any) {
    const formGroups: any = [];
    data.forEach((item: any) => {
      const { id } = item;

      formGroups.push(
        this._formBuilder.group({
          routine: [{ value: item.id, disabled: true }, [Validators.required]],
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

    const config = this.getConfig();

    const { title, description, routines } = this.workoutForm.getRawValue();
    const routineIds = routines.map((obj: any) => obj.routine);

    const form = {
      title,
      description,
      client: config.client,
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
          this.closeDialog();
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

    if (this._ref) {
      this._ref.close();
    }
  }
}
