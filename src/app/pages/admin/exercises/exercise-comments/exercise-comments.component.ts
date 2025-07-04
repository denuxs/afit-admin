import { Component, inject, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

import { Comment, Exercise } from 'app/domain';
import { ExerciseService } from 'app/services';

@Component({
  selector: 'app-exercise-comments',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './exercise-comments.component.html',
  styleUrl: './exercise-comments.component.scss',
})
export class ExerciseCommentsComponent implements OnInit {
  private readonly _exerciseService = inject(ExerciseService);

  @Input() exercise: Exercise | null = null;

  comments$!: Observable<Comment[]>;

  ngOnInit(): void {
    if (this.exercise) {
      this.getComments(this.exercise.id);
    }
  }

  getComments(exerciseId: number) {
    this.comments$ = this._exerciseService.fetchComments(exerciseId);
  }
}
