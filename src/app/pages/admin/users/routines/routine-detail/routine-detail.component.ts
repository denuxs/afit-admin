import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  ReactiveFormsModule,
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
  FormControl,
} from '@angular/forms';

import { Exercise, ExerciseList, Workout } from 'app/domain';
import { ExerciseService, WorkoutService } from 'app/services';
import { FormControlPipe } from 'app/pipes/form-control.pipe';

import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-routine-detail',
  standalone: true,
  imports: [
    SelectModule,
    ReactiveFormsModule,
    ButtonModule,
    TableModule,
    FormControlPipe,
  ],
  templateUrl: './routine-detail.component.html',
  styleUrl: './routine-detail.component.scss',
})
export class RoutineDetailComponent implements OnInit {
  private readonly _formBuilder = inject(UntypedFormBuilder);
  private readonly _exerciseService = inject(ExerciseService);
  private readonly _workoutService = inject(WorkoutService);

  @Input() workout: Workout | null = null;
  @Input() index = 0;
  @Input() form: any;
  @Output() formChange: EventEmitter<any> = new EventEmitter<any>();

  exercisesList!: Exercise[];

  constructor() {}

  ngOnInit(): void {
    this.getExercises();

    // if (this.workout) {
    //   const { exercises } = this.workout;
    //   // this.setExercises(exercises);
    // }
  }

  get exercises(): UntypedFormArray {
    return this.form.get('exercises') as UntypedFormArray;
  }

  sets(i: number): UntypedFormArray {
    return this.exercises.at(i).get('sets') as UntypedFormArray;
  }

  getExercises() {
    this._exerciseService.fetchExercises().subscribe({
      next: (response: ExerciseList) => {
        this.exercisesList = response.results;
      },
    });
  }

  // setExercises(data: any) {
  //   const formGroups: any = [];

  //   data.forEach((item: any) => {
  //     const { exercise, data, workout, description } = item;
  //     formGroups.push(
  //       this._formBuilder.group({
  //         id: [item.id],
  //         workout: [workout],
  //         exercise: [exercise.id],
  //         description: [description],
  //         // data: [data],
  //       })
  //     );
  //   });

  //   formGroups.forEach((item: any) => {
  //     this.exercises.push(item);
  //   });
  // }

  addExercise(): void {
    const formGroup = this._formBuilder.group({
      id: [null],
      workout: [this.workout?.id, []],
      exercise: ['', []],
      description: ['', []],
      sets: this._formBuilder.array([
        this._formBuilder.group({
          rept: [3, []],
          weight: [8, []],
        }),
      ]),
    });

    this.exercises.push(formGroup);
  }

  addSet(exerciseIndex: number): void {
    const formGroup = this._formBuilder.group({
      rept: [3, []],
      weight: [8, []],
    });

    this.sets(exerciseIndex).push(formGroup);
  }

  removeExercise(index: number, item: any): void {
    const exerciseId = item.get('id').value;

    if (!exerciseId) {
      this.exercises.removeAt(index);
      this.formChange.emit(this.exercises.value);
      return;
    }

    this._workoutService.deleteDetailExercise(exerciseId).subscribe({
      next: () => {
        this.exercises.removeAt(index);
        this.formChange.emit(this.exercises.value);
      },
    });
  }
}
