import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
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
import { debounceTime, takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ExerciseService, RoutineService } from 'app/services';
import { Exercise, Routine, RoutineDto, UserList } from 'app/interfaces';

import {
  CdkDragDrop,
  CdkDropList,
  CdkDrag,
  moveItemInArray,
} from '@angular/cdk/drag-drop';

import { AccordionModule } from 'primeng/accordion';

import { ScrollPanelModule } from 'primeng/scrollpanel';

import {
  PrimeEditorComponent,
  PrimeInputComponent,
  PrimeSelectComponent,
} from 'app/components';

@Component({
  selector: 'app-routine-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    CdkDropList,
    CdkDrag,
    AccordionModule,
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
  private readonly _routineService = inject(RoutineService);

  private readonly _unsubscribeAll: Subject<any> = new Subject<any>();

  routineForm!: UntypedFormGroup;

  exercisesList!: Exercise[];
  exercises$!: Observable<Exercise[]>;
  users$!: Observable<UserList>;

  routine!: Routine;
  userId = 0;

  title = 'Crear Rutina';

  tabSelected = 0;
  filteredExercises!: any;

  searchControl = new FormControl();

  levels = [
    { id: 'beginner', name: 'Principiante' },
    { id: 'medium', name: 'Intermedio' },
    { id: 'advanced', name: 'Avanzado' },
  ];

  // days = [
  //   { id: 1, name: 'Lunes' },
  //   { id: 2, name: 'Martes' },
  //   { id: 3, name: 'Miercoles' },
  //   { id: 4, name: 'Jueves' },
  //   { id: 5, name: 'Viernes' },
  //   { id: 6, name: 'Sabado' },
  //   { id: 7, name: 'Domingo' },
  // ];

  constructor() {
    this.routineForm = this._formBuilder.group({
      title: ['', [Validators.required]],
      description: ['', []],
      level: ['', [Validators.required]],
      user: [0, [Validators.required]],
      exercises: this._formBuilder.array([]),
    });
  }

  ngOnInit(): void {
    this.loadExercises();
    this.handleExerciseFilter();

    const routineId = this._route.snapshot.paramMap.get('id');

    if (routineId) {
      this.title = 'Editar Rutina';
      this.getRoutine(Number(routineId));
    }
  }

  handleExerciseFilter() {
    this.searchControl.valueChanges.pipe(debounceTime(300)).subscribe(query => {
      this.filteredExercises = this.exercisesList.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
    });
  }

  getRoutine(routineId: number) {
    this._routineService
      .get(routineId)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (routine: Routine) => {
          this.routine = routine;

          this.setFormFields(routine);
        },
      });
  }

  setFormFields(routine: Routine) {
    const { title, description, level, exercises } = routine;

    const form = {
      title: title,
      description: description,
      level: level,
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
    const routineId = this.routine ? this.routine.id : null;
    const nextOrder =
      this.exercises.length > 0
        ? Math.max(...this.exercises.controls.map(c => c.get('order')?.value)) +
          1
        : 1;

    const formGroup = this._formBuilder.group({
      id: [null],
      routine: [routineId, []],
      exercise: [id, []],
      name: [name, []],
      description: ['', []],
      order: [nextOrder, []],
      sets: this._formBuilder.array([
        this._formBuilder.group({
          sets: [4, []],
          rept: [10, []],
          weight: [0, []],
        }),
      ]),
    });

    this.exercises.push(formGroup);
    this.tabSelected = exercise.id;
  }

  addSet(exerciseIndex: number): void {
    const formGroup = this._formBuilder.group({
      sets: [4, []],
      rept: [10, []],
      weight: [0, []],
    });

    this.sets(exerciseIndex).push(formGroup);
  }

  removeExercise(index: number, item: any): void {
    const exerciseId = item.get('id').value;

    if (!exerciseId) {
      this.exercises.removeAt(index);
      this.handleOrder();
      return;
    }

    this._routineService.deleteDetailExercise(exerciseId).subscribe({
      next: () => {
        this.exercises.removeAt(index);
        this.handleOrder();
      },
    });
  }

  removeSet(exerciseIndex: any, index: any) {
    this.sets(exerciseIndex).removeAt(index);
  }

  setExercises(exercises: any[]) {
    for (const item of exercises) {
      const { exercise, sets, routine, description, level, order } = item;

      const new_sets: any = [];
      for (const item of sets) {
        const formGroup = this._formBuilder.group({
          sets: [item.sets, []],
          rept: [item.rept, []],
          weight: [item.weight, []],
        });

        new_sets.push(formGroup);
      }

      const formGroup = this._formBuilder.group({
        id: [item.id],
        routine: [routine],
        exercise: [exercise.id],
        name: [exercise.name],
        level: [level],
        order: [order],
        description: [description],
        sets: this._formBuilder.array(new_sets),
      });

      this.exercises.push(formGroup);
    }
  }

  handleSubmit(): void {
    if (this.routineForm.invalid) {
      this.routineForm.markAllAsTouched();
      return;
    }

    const { title, description, level, exercises } = this.routineForm.value;

    const form: any = {
      title,
      description,
      exercises,
      level,
    };

    if (this.routine) {
      this.updateWorkout(this.routine.id, form);
      return;
    }

    this.createWorkout(form);
  }

  createWorkout(form: RoutineDto) {
    this._routineService
      .create(form)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: Routine) => {
          const url = `/admin/routines`;
          this._router.navigateByUrl(url);
        },
        error: errors => this.setFormErrors(errors),
      });
  }

  updateWorkout(id: number, form: RoutineDto) {
    this._routineService
      .update(id, form)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: Routine) => {
          const url = `/admin/routines`;
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

  handleDragDrop(event: CdkDragDrop<any>) {
    const previousIndex = event.previousIndex;
    const currentIndex = event.currentIndex;

    moveItemInArray(this.exercises.controls, previousIndex, currentIndex);

    this.handleOrder();
  }

  handleOrder(): void {
    this.exercises.controls.forEach((control, index) => {
      control.get('order')?.setValue(index + 1);
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
