import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { ExerciseService } from 'app/services';
import { ExerciseFormComponent } from '../exercise-form/exercise-form.component';

@Component({
  selector: 'app-exercise-create',
  standalone: true,
  imports: [ExerciseFormComponent],
  templateUrl: './exercise-create.component.html',
  styleUrl: './exercise-create.component.scss',
})
export class ExerciseCreateComponent {
  private readonly _router = inject(Router);

  private readonly _exerciseService = inject(ExerciseService);
  private readonly _unsubscribeAll: Subject<any> = new Subject<any>();

  onFormChange(form: FormData) {
    this._exerciseService
      .saveExercise(form)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: () => {
          this._router.navigateByUrl('/admin/exercises');
        },
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
