import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Workout } from 'app/domain';
import { WorkoutService } from 'app/services';
import { debounceTime, distinctUntilChanged, Observable, Subject } from 'rxjs';
import { RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-workouts',
  standalone: true,
  imports: [NgIf, AsyncPipe, DatePipe, RouterLink, ReactiveFormsModule],
  templateUrl: './workouts.component.html',
  styleUrl: './workouts.component.scss',
})
export class WorkoutsComponent implements OnInit {
  private readonly _workoutService = inject(WorkoutService);

  workouts$!: Observable<Workout[]>;
  searchControl = new FormControl();

  ngOnInit(): void {
    this.search('');

    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((query) => {
        this.search(query);
      });
  }

  search(query: string) {
    this.workouts$ = this._workoutService.fetchWorkouts({
      search: query,
      ordering: 'day',
    });
  }
}
