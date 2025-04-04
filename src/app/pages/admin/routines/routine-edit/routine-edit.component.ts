import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { WorkoutService } from 'app/services';
import { Workout, WorkoutDto } from 'app/domain';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RoutineFormComponent } from '../routine-form/routine-form.component';

@Component({
  selector: 'app-routine-edit',
  standalone: true,
  imports: [RoutineFormComponent, ProgressSpinnerModule],
  templateUrl: './routine-edit.component.html',
  styleUrl: './routine-edit.component.scss',
})
export class RoutineEditComponent implements OnInit {
  private readonly _route = inject(ActivatedRoute);
  private readonly _router = inject(Router);

  private readonly _workoutService = inject(WorkoutService);
  private readonly _unsubscribeAll: Subject<any> = new Subject<any>();

  workout!: any;
  workoutId: number = 0;
  loading: boolean = false;

  ngOnInit(): void {
    const workoutId = this._route.snapshot.paramMap.get('id');
    if (workoutId) {
      this.workoutId = +workoutId;
      this.getRoutine(Number(workoutId));
    }
  }

  getRoutine(workoutId: number) {
    this.loading = true;
    this._workoutService
      .showWorkout(workoutId)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: Workout) => {
          this.workout = response;
          this.loading = false;
        },
        error: (err) => {
          console.log(err);
          this.loading = false;
        },
      });
  }

  onFormChange(form: WorkoutDto) {
    this._workoutService.updateWorkout(this.workoutId, form).subscribe({
      next: (response: Workout) => {
        const url = `/admin/workouts`;
        this._router.navigateByUrl(url);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
