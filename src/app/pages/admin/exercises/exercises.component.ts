import { Component, inject, OnInit } from '@angular/core';
import { Exercise } from 'app/domain';
import { ExerciseService } from 'app/services';
import { Observable } from 'rxjs';
import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-exercises',
  standalone: true,
  imports: [AsyncPipe, DatePipe, NgIf, RouterLink],
  templateUrl: './exercises.component.html',
  styleUrl: './exercises.component.scss',
})
export class ExercisesComponent implements OnInit {
  private readonly _exerciseService = inject(ExerciseService);

  exercises$!: Observable<Exercise[]>;

  ngOnInit(): void {
    this.exercises$ = this._exerciseService.fetchExercises();
  }
}
