import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AsyncPipe } from '@angular/common';

import { Measure, MeasureDto, User } from 'app/domain';
import { MeasuresService, UserService } from 'app/services';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import {
  PrimeCheckboxComponent,
  PrimeInputComponent,
  PrimeSelectComponent,
  PrimeTextareaComponent,
} from 'app/components';

@Component({
  selector: 'app-measure-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    PrimeTextareaComponent,
    PrimeInputComponent,
    PrimeSelectComponent,
    AsyncPipe,
    PrimeCheckboxComponent,
  ],
  templateUrl: './measure-form.component.html',
  styleUrl: './measure-form.component.scss',
})
export class MeasureFormComponent implements OnInit, OnDestroy {
  private readonly _formBuilder = inject(FormBuilder);

  private readonly _config = inject(DynamicDialogConfig);
  private readonly _ref = inject(DynamicDialogRef);

  private readonly _measureService = inject(MeasuresService);
  private readonly _unsubscribeAll: Subject<any> = new Subject<any>();

  private readonly _userService = inject(UserService);

  measureForm!: FormGroup;
  measure!: Measure;

  users$!: Observable<User[]>;

  ngOnInit(): void {
    this.measureForm = this._formBuilder.group({
      user: ['', [Validators.required]],
      comment: ['', []],
      weight: [0, []],
      waist: [0, []],
      abdomen: [0, []],
      chest: [0, []],
      hips: [0, []],
      back: [0, []],
      left_bicep: [0, []],
      right_bicep: [0, []],
      left_forearm: [0, []],
      right_forearm: [0, []],
      left_thigh: [0, []],
      right_thigh: [0, []],
      left_calf: [0, []],
      right_calf: [0, []],
      glutes: [0, []],
      is_active: [true, []],
    });

    this.getClients();

    const config = this.getConfig();

    if (config && 'measure' in config) {
      const { measure } = config;

      this.measure = measure;
      this.setFormValue(measure);
    }
  }

  getClients() {
    const params = {
      ordering: '-id',
      paginator: null,
      role: 'client',
    };
    this.users$ = this._userService.all(params);
  }

  getConfig() {
    return this._config.data;
  }

  setFormValue(measure: Measure) {
    const measures = measure.measures;

    const form = {
      user: measure.user,
      comment: measure.comment,
      weight: measures.weight,
      waist: measures.waist,
      abdomen: measures.abdomen,
      chest: measures.chest,
      hips: measures.hips,
      back: measures.back,
      left_bicep: measures.left_bicep,
      right_bicep: measures.right_bicep,
      left_forearm: measures.left_forearm,
      right_forearm: measures.right_forearm,
      left_thigh: measures.left_thigh,
      right_thigh: measures.right_thigh,
      left_calf: measures.left_calf,
      right_calf: measures.right_calf,
      glutes: measures.glutes,
    };

    this.measureForm.patchValue(form);
  }

  handleSubmit(): void {
    if (this.measureForm.invalid) {
      this.measureForm.markAllAsTouched();
      return;
    }

    const form = this.measureForm.value;

    const body: MeasureDto = {
      user: form.user,
      comment: form.comment,
      is_active: form.is_active,
      measures: {
        weight: form.weight,
        waist: form.waist,
        abdomen: form.abdomen,
        chest: form.chest,
        hips: form.hips,
        back: form.back,
        left_bicep: form.left_bicep,
        right_bicep: form.right_bicep,
        left_forearm: form.left_forearm,
        right_forearm: form.right_forearm,
        left_thigh: form.left_thigh,
        right_thigh: form.right_thigh,
        left_calf: form.left_calf,
        right_calf: form.right_calf,
        glutes: form.glutes,
      },
    };

    if (this.measure) {
      this.updateMeasure(this.measure.id, body);
      return;
    }

    this.createMeasure(body);
  }

  createMeasure(form: MeasureDto) {
    this._measureService
      .create(form)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: () => {
          this.closeDialog();
        },
        error: errors => this.setFormErrors(errors),
      });
  }

  updateMeasure(id: number, form: MeasureDto) {
    this._measureService
      .update(id, form)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: () => {
          this.closeDialog();
        },
        error: errors => this.setFormErrors(errors),
      });
  }

  closeDialog() {
    this._ref.close(true);
  }

  setFormErrors(errors: any) {
    for (const field in errors) {
      if (this.measureForm.controls[field]) {
        const control = this.measureForm.get(field);
        control?.setErrors({ server: errors[field].join(' ') });
      }
    }

    this.measureForm.markAllAsTouched();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();

    if (this._ref) {
      this._ref.close();
    }
  }
}
