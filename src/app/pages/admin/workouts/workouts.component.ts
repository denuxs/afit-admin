import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Workout } from 'app/domain';
import { WorkoutService } from 'app/services';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-workouts',
  standalone: true,
  imports: [NgIf, AsyncPipe, DatePipe, RouterLink],
  templateUrl: './workouts.component.html',
  styleUrl: './workouts.component.scss',
})
export class WorkoutsComponent implements OnInit {
  private readonly _workoutService = inject(WorkoutService);

  workouts$!: Observable<Workout[]>;

  ngOnInit(): void {
    this.workouts$ = this._workoutService.fetchWorkouts();
  }
}
