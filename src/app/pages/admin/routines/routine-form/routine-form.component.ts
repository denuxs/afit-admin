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
import { RoutineService } from 'app/services';

@Component({
  selector: 'app-routine-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './routine-form.component.html',
  styleUrl: './routine-form.component.scss',
})
export class RoutineFormComponent implements OnInit {
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  private readonly _formBuilder = inject(FormBuilder);

  private readonly _routineService = inject(RoutineService);
  private readonly _unsubscribeAll: Subject<any> = new Subject<any>();

  routineForm!: FormGroup;

  constructor() {
    this.routineForm = this._formBuilder.group({
      name: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    const routineId = this._route.snapshot.paramMap.get('id');
    if (routineId) {
      this.getRoutine(+routineId);
    }
  }

  getRoutine(routineId: number) {
    this._routineService
      .showRoutine(routineId)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: any) => {
          const form = {
            name: response.name,
          };
          this.routineForm.setValue(form);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  handleSubmit(): void {
    if (this.routineForm.invalid) {
      this.routineForm.markAllAsTouched();
      return;
    }

    const { name } = this.routineForm.value;

    const form: RoutineDto = {
      name,
    };

    this._routineService
      .saveRoutine(form)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: () => {
          this._router.navigateByUrl('/admin/routines');
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  checkErrors(field: string): string {
    const form: any = this.routineForm.get(field);

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
