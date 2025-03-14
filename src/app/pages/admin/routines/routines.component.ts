import { Component, inject, OnInit } from '@angular/core';
import { Workout } from 'app/domain';
import { WorkoutService } from 'app/services';
import { Observable } from 'rxjs';
import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-routines',
  standalone: true,
  imports: [AsyncPipe, DatePipe, NgIf, RouterLink],
  templateUrl: './routines.component.html',
  styleUrl: './routines.component.scss',
})
export class RoutinesComponent implements OnInit {
  private readonly _workoutService = inject(WorkoutService);

  workoust$!: Observable<Workout[]>;

  ngOnInit(): void {
    this.workoust$ = this._workoutService.fetchWorkouts();
  }
}
