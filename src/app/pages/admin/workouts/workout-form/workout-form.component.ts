import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { RoutineDto } from 'app/domain';
import { WorkoutService } from 'app/services';

@Component({
  selector: 'app-workout-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './workout-form.component.html',
  styleUrl: './workout-form.component.scss',
})
export class WorkoutFormComponent implements OnInit {
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  private readonly _formBuilder = inject(FormBuilder);

  private readonly _workoutService = inject(WorkoutService);
  private readonly _unsubscribeAll: Subject<any> = new Subject<any>();

  workoutForm!: FormGroup;

  constructor() {
    this.workoutForm = this._formBuilder.group({
      name: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    const workoutId = this._route.snapshot.paramMap.get('id');
    if (workoutId) {
      this.getRoutine(+workoutId);
    }
  }

  getRoutine(workoutId: number) {
    this._workoutService
      .showWorkout(workoutId)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: any) => {
          const form = {
            name: response.name,
          };
          this.workoutForm.setValue(form);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  handleSubmit(): void {
    if (this.workoutForm.invalid) {
      this.workoutForm.markAllAsTouched();
      return;
    }

    const { name } = this.workoutForm.value;

    const form: RoutineDto = {
      name,
    };

    this._workoutService
      .saveWorkout(form)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: () => {
          this._router.navigateByUrl('/admin/workouts');
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  checkErrors(field: string): string {
    const form: any = this.workoutForm.get(field);

    if (form.invalid && (form.dirty || form.touched)) {
      if (form?.hasError('required')) {
        return 'Value is required';
      }

      // if (form?.hasError('email')) {
      //   return 'Value is invalid';
      // }
    }
    return '';
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
