import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';

import { MeasureDto, User } from 'app/domain';
import { MeasuresService, UserService } from 'app/services';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-measures-form',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe],
  templateUrl: './measures-form.component.html',
  styleUrl: './measures-form.component.scss',
})
export class MeasuresFormComponent implements OnInit {
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  private readonly _formBuilder = inject(FormBuilder);

  private readonly _measureService = inject(MeasuresService);
  private readonly _userService = inject(UserService);
  private readonly _unsubscribeAll: Subject<any> = new Subject<any>();

  measureForm: FormGroup;
  users$!: Observable<User[]>;

  measureId: number = 0;

  constructor() {
    this.measureForm = this._formBuilder.group({
      user: ['', [Validators.required]],
      abdomen: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getUsers();

    const measureId = this._route.snapshot.paramMap.get('id');
    if (measureId) {
      this.measureId = +measureId;
      this.getMeasure(+measureId);
    }
  }

  getMeasure(measureId: number) {
    this._measureService
      .showMeasure(measureId)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: any) => {
          const form = {
            user: response.user.id,
            abdomen: response.abdomen,
          };
          this.measureForm.patchValue(form);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  getUsers() {
    this.users$ = this._userService.getUsers();
  }

  handleSubmit(): void {
    if (this.measureForm.invalid) {
      this.measureForm.markAllAsTouched();
      return;
    }

    const { user, abdomen } = this.measureForm.value;

    const form: MeasureDto = {
      user,
      abdomen,
    };

    if (this.measureId) {
      this.update(form);
    } else {
      this.save(form);
    }
  }

  save(form: MeasureDto) {
    this._measureService
      .saveMeasure(form)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: () => {
          this._router.navigateByUrl('/admin/measures');
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  update(form: MeasureDto) {
    this._measureService
      .updateMeasure(this.measureId, form)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: () => {
          this._router.navigateByUrl('/admin/measures');
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  checkErrors(field: string): string {
    const form: any = this.measureForm.get(field);

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
