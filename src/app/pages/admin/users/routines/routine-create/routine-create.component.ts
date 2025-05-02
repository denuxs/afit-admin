import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { WorkoutService } from 'app/services';
import { RoutineFormComponent } from '../routine-form/routine-form.component';
import { Workout, WorkoutDto } from 'app/domain';

@Component({
  selector: 'app-routine-create',
  standalone: true,
  imports: [RoutineFormComponent],
  templateUrl: './routine-create.component.html',
  styleUrl: './routine-create.component.scss',
})
export class RoutineCreateComponent implements OnInit {
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);

  private readonly _workoutService = inject(WorkoutService);
  userId!: number;

  ngOnInit(): void {
    const userId = this._route.snapshot.paramMap.get('userId');
    if (userId) {
      this.userId = +userId;
    }
  }

  onFormChange(form: WorkoutDto) {
    this._workoutService.saveWorkout(form).subscribe({
      next: (response: Workout) => {
        const url = `/admin/users/${this.userId}/workouts`;
        this._router.navigateByUrl(url);
      },
    });
  }
}
