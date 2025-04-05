import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AsyncPipe } from '@angular/common';

import { ExerciseService } from 'app/services';
import { Exercise } from 'app/domain';

import { ExerciseFormComponent } from '../exercise-form/exercise-form.component';

import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-exercise-edit',
  standalone: true,
  imports: [AsyncPipe, ExerciseFormComponent, ProgressSpinnerModule],
  templateUrl: './exercise-edit.component.html',
  styleUrl: './exercise-edit.component.scss',
})
export class ExerciseEditComponent implements OnInit {
  private readonly _route = inject(ActivatedRoute);
  private readonly _router = inject(Router);

  private readonly _exerciseService = inject(ExerciseService);
  private readonly _unsubscribeAll: Subject<any> = new Subject<any>();

  exercise$!: Observable<Exercise>;
  exerciseId: number = 0;

  ngOnInit(): void {
    const exerciseId = this._route.snapshot.paramMap.get('id');

    if (exerciseId) {
      this.exerciseId = +exerciseId;
      this.getExercise(Number(exerciseId));
    }
  }

  getExercise(exerciseId: number) {
    this.exercise$ = this._exerciseService.showExercise(exerciseId);
  }

  onFormChange(form: FormData) {
    this._exerciseService
      .updateExercise(this.exerciseId, form)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: () => {
          this._router.navigateByUrl('/admin/exercises');
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
