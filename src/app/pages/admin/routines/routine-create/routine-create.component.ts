import { Component, inject } from '@angular/core';
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
export class RoutineCreateComponent {
  private readonly _router = inject(Router);

  private readonly _workoutService = inject(WorkoutService);

  onFormChange(form: WorkoutDto) {
    this._workoutService.saveWorkout(form).subscribe({
      next: (response: Workout) => {
        const url = `/admin/workouts/${response.id}/edit`;
        this._router.navigateByUrl(url);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
