import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormArray,
  FormArray,
  UntypedFormGroup,
  UntypedFormBuilder,
  UntypedFormControl,
  Validators,
  AbstractControl,
  FormControl,
} from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { AsyncPipe, NgFor } from '@angular/common';
import { debounceTime, takeUntil } from 'rxjs/operators';

import { ExerciseService, WorkoutService } from 'app/services';
import { Exercise, UserList, Workout, WorkoutDto } from 'app/domain';

import { SelectModule } from 'primeng/select';
import { EditorModule } from 'primeng/editor';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';

import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextModule } from 'primeng/inputtext';
import {
  CdkDragDrop,
  CdkDropList,
  CdkDrag,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { AccordionModule } from 'primeng/accordion';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { ScrollPanelModule } from 'primeng/scrollpanel';

import { PrimeInputComponent } from 'app/components/prime-input/prime-input.component';
import { PrimeSelectComponent } from 'app/components/prime-select/prime-select.component';
import { PrimeEditorComponent } from 'app/components/prime-editor/prime-editor.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Paginator } from 'primeng/paginator';

@Component({
  selector: 'app-routine-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    ButtonModule,
    SelectModule,
    EditorModule,
    CheckboxModule,
    RadioButtonModule,
    InputTextModule,
    CdkDropList,
    CdkDrag,
    NgFor,
    AccordionModule,
    AutoCompleteModule,
    SelectButtonModule,
    TableModule,
    ScrollPanelModule,
    PrimeInputComponent,
    PrimeSelectComponent,
    PrimeEditorComponent,
  ],
  templateUrl: './routine-form.component.html',
  styleUrl: './routine-form.component.scss',
})
export class RoutineFormComponent implements OnInit, OnDestroy {
  private readonly _route = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _formBuilder = inject(UntypedFormBuilder);

  private readonly _exerciseService = inject(ExerciseService);
  private readonly _workoutService = inject(WorkoutService);

  private readonly _unsubscribeAll: Subject<any> = new Subject<any>();

  routineForm!: UntypedFormGroup;

  exercisesList!: Exercise[];
  exercises$!: Observable<Exercise[]>;
  users$!: Observable<UserList>;

  workout!: Workout;
  userId = 0;

  tabSelected = 0;
  filteredExercises!: any;

  searchControl = new FormControl();

  levels = [
    { id: 'beginner', name: 'Principiante' },
    { id: 'medium', name: 'Intermedio' },
    { id: 'advanced', name: 'Avanzado' },
  ];

  days = [
    { id: 1, name: 'Lunes' },
    { id: 2, name: 'Martes' },
    { id: 3, name: 'Miercoles' },
    { id: 4, name: 'Jueves' },
    { id: 5, name: 'Viernes' },
    { id: 6, name: 'Sabado' },
    { id: 7, name: 'Domingo' },
  ];

  constructor() {
    this.routineForm = this._formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', []],
      level: ['', [Validators.required]],
      day: ['', [Validators.required]],
      user: [0, [Validators.required]],
      exercises: this._formBuilder.array([]),
      is_active: [true, []],
    });
  }

  ngOnInit(): void {
    this.loadExercises();
    this.handleExerciseFilter();

    const workoutId = this._route.snapshot.paramMap.get('id');

    const userId = this._route.snapshot.paramMap.get('userid');
    this.userId = Number(userId);

    if (workoutId) {
      this.getWorkout(Number(workoutId));
    }
  }

  handleExerciseFilter() {
    this.searchControl.valueChanges.pipe(debounceTime(300)).subscribe(query => {
      this.filteredExercises = this.exercisesList.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
    });
  }

  getWorkout(workoutId: number) {
    this._workoutService
      .get(workoutId)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (workout: Workout) => {
          this.workout = workout;

          this.setFormFields(workout);
        },
      });
  }

  setFormFields(workout: Workout) {
    const { name, description, day, level, user, is_active, exercises } =
      workout;

    const form = {
      name: name,
      description: description,
      day: day,
      level: level,
      user: user.id,
      is_active: is_active,
    };

    this.routineForm.patchValue(form);
    this.setExercises(exercises);
  }

  loadExercises() {
    const params = {
      ordering: 'name',
      paginator: null,
    };
    this._exerciseService.all(params).subscribe({
      next: (response: Exercise[]) => {
        this.exercisesList = response;
        this.filteredExercises = response;
      },
    });
  }

  get exercises(): FormArray {
    return this.routineForm.get('exercises') as FormArray;
  }

  sets(i: number): UntypedFormArray {
    return this.exercises.at(i).get('sets') as UntypedFormArray;
  }

  addExercise(exercise: Exercise): void {
    const { name, id } = exercise;

    const formGroup = this._formBuilder.group({
      id: [null],
      workout: [this.workout.id, []],
      exercise: [id, []],
      name: [name, []],
      description: ['', []],
      order: [0, []],
      sets: this._formBuilder.array([
        this._formBuilder.group({
          sets: [1, []],
          rept: [4, []],
          weight: [0, []],
        }),
      ]),
    });

    this.exercises.push(formGroup);
    this.tabSelected = exercise.id;
  }

  addSet(exerciseIndex: number): void {
    const formGroup = this._formBuilder.group({
      sets: [1, []],
      rept: [4, []],
      weight: [0, []],
    });

    this.sets(exerciseIndex).push(formGroup);
  }

  removeExercise(index: number, item: any): void {
    const exerciseId = item.get('id').value;

    if (!exerciseId) {
      this.exercises.removeAt(index);
      return;
    }

    this._workoutService.deleteDetailExercise(exerciseId).subscribe({
      next: () => {
        this.exercises.removeAt(index);
      },
    });
  }

  removeSet(exerciseIndex: any, index: any) {
    this.sets(exerciseIndex).removeAt(index);
  }

  setExercises(data: any) {
    const formGroups: any = [];

    data.forEach((item: any) => {
      const { exercise, data, workout, description, level } = item;

      const sets: any = [];
      if (data) {
        data.forEach((item: any) => {
          sets.push(
            this._formBuilder.group({
              sets: [item.sets, []],
              rept: [item.rept, []],
              weight: [item.weight, []],
            })
          );
        });
      }

      formGroups.push(
        this._formBuilder.group({
          id: [item.id],
          workout: [workout],
          exercise: [exercise.id],
          name: [exercise.name],
          level: [level],
          order: [exercise.order],
          description: [description],
          sets: this._formBuilder.array(sets),
        })
      );
    });

    formGroups.forEach((item: any) => {
      this.exercises.push(item);
    });
  }

  handleSubmit(): void {
    if (this.routineForm.invalid) {
      this.routineForm.markAllAsTouched();
      return;
    }

    const { name, description, day, level, exercises, user, is_active } =
      this.routineForm.value;

    // exercises set order with index of exercises
    exercises.forEach((item: any, index: number) => {
      item.order = index + 1;
    });

    const form: WorkoutDto = {
      name,
      description,
      day,
      user: this.userId,
      exercises,
      is_active,
      level,
    };

    if (this.workout) {
      this.updateWorkout(this.workout.id, form);
      return;
    }

    this.createWorkout(form);
  }

  createWorkout(form: WorkoutDto) {
    this._workoutService
      .create(form)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: () => {
          const url = `/admin/clients/${this.userId}/view/workouts/${this.userId}`;
          this._router.navigateByUrl(url);
        },
        error: errors => this.setFormErrors(errors),
      });
  }

  updateWorkout(id: number, form: WorkoutDto) {
    this._workoutService
      .update(id, form)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: () => {
          const url = `/admin/clients/${this.userId}/view/workouts/${this.userId}`;
          this._router.navigateByUrl(url);
        },
        error: errors => this.setFormErrors(errors),
      });
  }

  setFormErrors(errors: any) {
    for (const field in errors) {
      if (this.routineForm.controls[field]) {
        const control = this.routineForm.get(field);
        control?.setErrors({ server: errors[field].join(' ') });
      }
    }

    this.routineForm.markAllAsTouched();
  }

  drop(event: any) {
    moveItemInArray(
      this.exercises.controls,
      event.previousIndex,
      event.currentIndex
    );

    this.exercises.controls[event.currentIndex].patchValue({
      order: event.previousIndex,
    });
  }

  selectExercise(exercise: any) {
    this.addExercise(exercise);
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
