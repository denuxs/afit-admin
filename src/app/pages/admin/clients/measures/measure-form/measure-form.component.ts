import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { Measure, MeasureDto } from 'app/domain';
import { MeasuresService } from 'app/services';

import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { MeasureImagesComponent } from '../measure-images/measure-images.component';
import { PrimeEditorComponent } from 'app/components/prime-editor/prime-editor.component';
import { PrimeInputComponent } from 'app/components/prime-input/prime-input.component';
@Component({
  selector: 'app-measure-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SelectModule,
    CheckboxModule,
    InputTextModule,
    TextareaModule,
    MeasureImagesComponent,
    PrimeEditorComponent,
    PrimeInputComponent,
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

  measureForm!: FormGroup;
  measure!: Measure;

  ngOnInit(): void {
    this.measureForm = this._formBuilder.group({
      comment: ['', []],
      abdomen: [0, []],
      arm_left: [0, []],
      arm_right: [0, []],
      back: [0, []],
      chest: [0, []],
      forearm: [0, []],
      glutes: [0, []],
      hips: [0, []],
      leg_left: [0, []],
      leg_right: [0, []],
      waist: [0, []],
      weight: [0, []],
      is_active: [true, []],
    });

    const config = this.getConfig();

    if (config && 'measure' in config) {
      const { measure } = config;

      this.measure = measure;
      this.setFormValue(measure);
    }
  }

  getConfig() {
    return this._config.data;
  }

  setFormValue(measure: Measure) {
    const measures = measure.measures;

    const form = {
      comment: measure.comment,
      abdomen: measures.abdomen,
      arm_left: measures.arm_left,
      arm_right: measures.arm_right,
      back: measures.back,
      chest: measures.chest,
      forearm: measures.forearm,
      glutes: measures.glutes,
      hips: measures.hips,
      leg_left: measures.leg_left,
      leg_right: measures.leg_right,
      waist: measures.waist,
      weight: measures.weight,
    };

    this.measureForm.patchValue(form);
  }

  handleSubmit(): void {
    if (this.measureForm.invalid) {
      this.measureForm.markAllAsTouched();
      return;
    }

    const form = this.measureForm.value;
    const config = this.getConfig();

    const body: MeasureDto = {
      client: config.client,
      comment: form.comment,
      is_active: form.is_active,
      measures: {
        abdomen: form.abdomen,
        arm_left: form.arm_left,
        arm_right: form.arm_right,
        back: form.back,
        chest: form.chest,
        forearm: form.forearm,
        glutes: form.glutes,
        hips: form.hips,
        leg_left: form.leg_left,
        leg_right: form.leg_right,
        waist: form.waist,
        weight: form.weight,
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
