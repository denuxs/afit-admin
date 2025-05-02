import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
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
import { AsyncPipe, JsonPipe, NgFor } from '@angular/common';
import { debounceTime } from 'rxjs/operators';

import { ExerciseService, UserService, WorkoutService } from 'app/services';
import {
  Exercise,
  ExerciseList,
  User,
  UserList,
  Workout,
  WorkoutDto,
} from 'app/domain';

import { SelectModule } from 'primeng/select';
import { EditorModule } from 'primeng/editor';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';

import { RoutineDetailComponent } from '../routine-detail/routine-detail.component';
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
import { FormControlPipe } from 'app/pipes/form-control.pipe';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { ScrollPanelModule } from 'primeng/scrollpanel';

@Component({
  selector: 'app-routine-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    ButtonModule,
    SelectModule,
    EditorModule,
    RoutineDetailComponent,
    CheckboxModule,
    RadioButtonModule,
    InputTextModule,
    CdkDropList,
    CdkDrag,
    NgFor,
    AccordionModule,
    AutoCompleteModule,
    JsonPipe,
    FormControlPipe,
    SelectButtonModule,
    TableModule,
    AsyncPipe,
    ScrollPanelModule,
  ],
  templateUrl: './routine-form.component.html',
  styleUrl: './routine-form.component.scss',
})
export class RoutineFormComponent implements OnInit {
  private readonly _formBuilder = inject(UntypedFormBuilder);

  private readonly _exerciseService = inject(ExerciseService);
  private readonly _workoutService = inject(WorkoutService);

  private readonly _userService = inject(UserService);
  private readonly _unsubscribeAll: Subject<any> = new Subject<any>();

  routineForm!: UntypedFormGroup;

  exercisesList!: Exercise[];
  exercises$!: Observable<Exercise[]>;
  users$!: Observable<UserList>;

  routineId: number = 0;
  modules = {
    toolbar: [
      // [{ header: 3 }, { header: 4 }],
      [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
      [{ color: [] }, { background: [] }],
      // [{ font: [] }],
      [{ align: [] }],
      ['clean'],
    ],
  };

  days = [
    { value: 1, label: 'Lunes' },
    { value: 2, label: 'Martes' },
    { value: 3, label: 'Miercoles' },
    { value: 4, label: 'Jueves' },
    { value: 5, label: 'Viernes' },
    { value: 6, label: 'Sabado' },
    { value: 7, label: 'Domingo' },
  ];

  @Input() workout: Workout | null = null;
  @Output() formChange: EventEmitter<WorkoutDto> =
    new EventEmitter<WorkoutDto>();

  @Input() userId!: number;

  tabSelected: number = 0;

  filteredExercises: any = [];

  searchControl = new FormControl();

  levels = [
    { value: 'beginner', label: 'Principiante' },
    { value: 'medium', label: 'Intermedio' },
    { value: 'advanced', label: 'Avanzado' },
  ];

  constructor() {
    this.searchControl.valueChanges.pipe(debounceTime(300)).subscribe(query => {
      this.filteredExercises = this.exercisesList.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
    });
  }

  ngOnInit(): void {
    this.getUsers();
    this.getExercises();

    this.routineForm = this._formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', []],
      level: ['', []],
      day: ['', [Validators.required]],
      user: [this.userId, [Validators.required]],
      exercises: this._formBuilder.array([]),
      is_active: [true, []],
    });

    if (this.workout) {
      const { name, description, day, level, user, is_active, exercises } =
        this.workout;

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
      workout: [this.workout?.id, []],
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

  getUsers(): void {
    this.users$ = this._userService.getUsers({ search: '' });
  }

  getExercises() {
    // this.exercises$ = this._exerciseService.fetchExercises();

    const params = {
      ordering: 'name',
    };
    this._exerciseService.fetchExercises(params).subscribe({
      next: (response: ExerciseList) => {
        this.exercisesList = response.results;
        this.filteredExercises = response.results;
      },
    });
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
      user,
      exercises,
      is_active,
      level,
    };

    this.formChange.emit(form);
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

  handleSearch(event: any) {
    const { query } = event;
    // console.log(query);
    // this.filteredExercises = this.exercisesList.filter(item =>
    //   item.name.toLowerCase().includes(query.toLowerCase())
    // );
  }

  selectExercise(exercise: any) {
    this.addExercise(exercise);
  }

  checkErrors(field: string): string {
    const form: any = this.routineForm.get(field);

    if (form.invalid && (form.dirty || form.touched)) {
      if (form?.hasError('required')) {
        return 'Campo requerido';
      }

      // if (form?.hasError('email')) {
      //   return 'Value is invalid';
      // }
    }
    return '';
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
