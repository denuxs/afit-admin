import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { MuscleDto } from 'app/domain';
import { MuscleService } from 'app/services';

@Component({
  selector: 'app-muscles-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './muscles-form.component.html',
  styleUrl: './muscles-form.component.scss',
})
export class MusclesFormComponent implements OnInit {
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  private readonly _formBuilder = inject(FormBuilder);

  private readonly _muscleService = inject(MuscleService);
  private readonly _unsubscribeAll: Subject<any> = new Subject<any>();

  muscleForm: FormGroup;

  muscleId: number = 0;

  constructor() {
    this.muscleForm = this._formBuilder.group({
      name: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    const muscleId = this._route.snapshot.paramMap.get('id');
    if (muscleId) {
      this.muscleId = +muscleId;
      this.getMuscle(+muscleId);
    }
  }

  getMuscle(muscleId: number) {
    this._muscleService
      .showMuscle(muscleId)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: any) => {
          const form = {
            name: response.name,
          };
          this.muscleForm.patchValue(form);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  handleSubmit(): void {
    if (this.muscleForm.invalid) {
      this.muscleForm.markAllAsTouched();
      return;
    }

    const { name } = this.muscleForm.value;

    const form: MuscleDto = {
      name,
    };

    if (this.muscleId) {
      this.update(form);
    } else {
      this.save(form);
    }
  }

  save(form: MuscleDto) {
    this._muscleService
      .saveMuscle(form)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: () => {
          this._router.navigateByUrl('/admin/muscles');
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  update(form: MuscleDto) {
    this._muscleService
      .updateMuscle(this.muscleId, form)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: () => {
          this._router.navigateByUrl('/admin/muscles');
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  checkErrors(field: string): string {
    const form: any = this.muscleForm.get(field);

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
