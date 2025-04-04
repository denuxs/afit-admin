import { Component, inject, Input, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
  FormControl,
} from '@angular/forms';

import { Exercise, Workout } from 'app/domain';
import { ExerciseService, WorkoutService } from 'app/services';

import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { FormControlPipe } from 'app/pipes/form-control.pipe';

@Component({
  selector: 'app-routine-detail',
  standalone: true,
  imports: [SelectModule, ReactiveFormsModule, ButtonModule, FormControlPipe],
  templateUrl: './routine-detail.component.html',
  styleUrl: './routine-detail.component.scss',
})
export class RoutineDetailComponent implements OnInit {
  private readonly _formBuilder = inject(UntypedFormBuilder);
  private readonly _exerciseService = inject(ExerciseService);
  private readonly _workoutService = inject(WorkoutService);

  @Input() workout: Workout | null = null;
  @Input() detailForm: UntypedFormGroup = new UntypedFormGroup({});

  exercisesList!: Exercise[];

  constructor() {}

  ngOnInit(): void {
    this.getExercises();

    if (this.workout) {
      const { exercises } = this.workout;
      this.setExercises(exercises);
    }
  }

  get exercises(): UntypedFormArray {
    return this.detailForm.get('exercises') as UntypedFormArray;
  }

  getExercises() {
    this._exerciseService.fetchExercises().subscribe({
      next: (response: Exercise[]) => {
        this.exercisesList = response;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  setExercises(data: any) {
    const formGroups: any = [];

    data.forEach((item: any) => {
      const { exercise, sets, repts, weight, workout, description } = item;
      formGroups.push(
        this._formBuilder.group({
          id: [item.id],
          workout: [workout],
          exercise: [exercise.id],
          description: [description],
          sets: [sets],
          repts: [repts],
          weight: [weight],
        }),
      );
    });

    formGroups.forEach((item: any) => {
      this.exercises.push(item);
    });
  }

  addExercise(): void {
    const formGroup = this._formBuilder.group({
      id: [null],
      workout: [this.workout?.id, []],
      exercise: ['', []],
      description: ['', []],
      sets: [4],
      repts: [12],
      weight: [0],
    });

    this.exercises.push(formGroup);
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
}
