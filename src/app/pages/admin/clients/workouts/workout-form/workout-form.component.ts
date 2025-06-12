import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormArray,
  FormGroup,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';

import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

import { WorkoutService } from 'app/services';
import { Client, Routine, Workout } from 'app/domain';

import { PrimeInputComponent } from 'app/components/prime-input/prime-input.component';
import { PrimeEditorComponent } from 'app/components/prime-editor/prime-editor.component';
import { RoutineListComponent } from '../routine-list/routine-list.component';

@Component({
  selector: 'app-workout-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    PrimeInputComponent,
    PrimeEditorComponent,
    CheckboxModule,
    ButtonModule,
    DialogModule,
  ],
  providers: [DialogService],
  templateUrl: './workout-form.component.html',
  styleUrl: './workout-form.component.scss',
})
export class WorkoutFormComponent implements OnInit, OnDestroy {
  private readonly _route = inject(ActivatedRoute);
  private readonly _formBuilder = inject(UntypedFormBuilder);
  private readonly _config = inject(DynamicDialogConfig);
  private readonly _ref = inject(DynamicDialogRef);
  private readonly _dialogService = inject(DialogService);

  private readonly _workoutService = inject(WorkoutService);
  private readonly _unsubscribeAll: Subject<any> = new Subject<any>();
  ref: DynamicDialogRef | undefined;

  workoutForm!: UntypedFormGroup;
  workout!: Workout;
  clients!: Client[];
  routines$!: Observable<Routine[]>;

  constructor() {
    this.workoutForm = this._formBuilder.group({
      title: ['', [Validators.required]],
      description: ['', []],
      is_active: [true, []],
      routines: this._formBuilder.array([]),
    });
  }

  ngOnInit(): void {
    const config = this.getConfig();

    if (config && 'workout' in config) {
      this.workout = config.workout;

      this.setFormValue(config.workout);
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

  get routines(): FormArray {
    return this.workoutForm.get('routines') as FormArray;
  }

  setRoutines(data: any) {
    const formGroups: any = [];
    data.forEach((item: any) => {
      formGroups.push(
        this._formBuilder.group({
          routine: [{ value: item.id, disabled: true }, [Validators.required]],
          title: [{ value: item.title, disabled: true }, [Validators.required]],
        })
      );
    });

    formGroups.forEach((item: any) => {
      this.routines.push(item);
    });
  }

  openRoutineModal(): void {
    this.ref = this._dialogService.open(RoutineListComponent, {
      header: 'Rutinas',
      modal: true,
      position: 'top',
      appendTo: 'body',
      closable: true,
      // contentStyle: { height: '300px' },
    });

    this.ref.onClose.subscribe((data: any) => {
      if (data) {
        console.log(data);
        this.addRoutine(data);
      }
    });
  }

  addRoutine(item: Routine): void {
    const formGroup: FormGroup = this._formBuilder.group({
      routine: [{ value: item.id, disabled: true }, [Validators.required]],
      title: [{ value: item.title, disabled: true }, [Validators.required]],
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
