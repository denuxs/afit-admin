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
import { debounceTime, takeUntil } from 'rxjs/operators';

import { ExerciseService, RoutineService } from 'app/services';
import { Exercise, Routine, RoutineDto, UserList } from 'app/domain';

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
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PrimeAvatarComponent } from 'app/components/prime-avatar/prime-avatar.component';

@Component({
  selector: 'app-routine-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    ButtonModule,
    SelectModule,
    EditorModule,
    CheckboxModule,
    RadioButtonModule,
    InputTextModule,
    CdkDropList,
    CdkDrag,
    AccordionModule,
    AutoCompleteModule,
    SelectButtonModule,
    TableModule,
    ScrollPanelModule,
    PrimeInputComponent,
    PrimeSelectComponent,
    PrimeEditorComponent,
    PrimeAvatarComponent,
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
      // day: ['', [Validators.required]],
      user: [0, [Validators.required]],
      exercises: this._formBuilder.array([]),
      is_active: [true, []],
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
    const { title, description, level, user, is_active, exercises } = routine;

    const form = {
      title: title,
      description: description,
      // day: day,
      level: level,
      // user: user.id,
      // is_active: is_active,
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
      routine: [this.routine.id, []],
      exercise: [id, []],
      name: [name, []],
      description: ['', []],
      order: [0, []],
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
      return;
    }

    // this._routineService.deleteDetailExercise(exerciseId).subscribe({
    //   next: () => {
    //     this.exercises.removeAt(index);
    //   },
    // });
  }

  removeSet(exerciseIndex: any, index: any) {
    this.sets(exerciseIndex).removeAt(index);
  }

  setExercises(exercises: any) {
    const formGroups: any = [];

    exercises.forEach((item: any) => {
      const { exercise, sets, routine, description, level } = item;

      const new_sets: any = [];
      if (sets) {
        sets.forEach((item: any) => {
          new_sets.push(
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
          routine: [routine],
          exercise: [exercise.id],
          name: [exercise.name],
          level: [level],
          order: [exercise.order],
          description: [description],
          sets: this._formBuilder.array(new_sets),
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

    // console.log(this.routineForm.value);
    // return;

    const { title, description, level, exercises, is_active } =
      this.routineForm.value;

    // exercises set order with index of exercises
    exercises.forEach((item: any, index: number) => {
      item.order = index + 1;
    });

    const form: any = {
      title,
      description,
      // user: this.userId,
      exercises,
      is_active,
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
