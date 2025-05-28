import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

import { Exercise } from 'app/domain';
import { ExerciseService } from 'app/services';

import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
  selector: 'app-exercise-view',
  standalone: true,
  imports: [ProgressSpinner, RouterLink, AsyncPipe],
  templateUrl: './exercise-view.component.html',
  styleUrl: './exercise-view.component.scss',
})
export class ExerciseViewComponent implements OnInit {
  private readonly _route = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _sanitizer = inject(DomSanitizer);

  private readonly _exerciseService = inject(ExerciseService);

  exercise$!: Observable<Exercise>;

  ngOnInit(): void {
    const exerciseId = this._route.snapshot.paramMap.get('id');
    if (exerciseId) {
      this.getExercise(+exerciseId);
    }
  }

  getExercise(exerciseId: number) {
    this.exercise$ = this._exerciseService.get(exerciseId);
  }

  byPassHTML(html: string) {
    return this._sanitizer.bypassSecurityTrustHtml(html);
  }
}
