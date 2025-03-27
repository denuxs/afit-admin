import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';

import { Measure, MeasureDto, User } from 'app/domain';
import { MeasuresService, UserService } from 'app/services';
import { AsyncPipe, NgIf } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { MeasureImagesComponent } from '../measure-images/measure-images.component';

@Component({
  selector: 'app-measures-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    SelectModule,
    MeasureImagesComponent,
    MeasureImagesComponent,
  ],
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
  avatarField: any;
  avatarPreview: any = '';

  photoPreview: string = 'https://placehold.co/200x200';
  photoField!: File;

  constructor() {
    this.measureForm = this._formBuilder.group({
      user: ['', [Validators.required]],
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
    });
  }

  ngOnInit(): void {
    this.getUsers();

    const measureId = this._route.snapshot.paramMap.get('id');
    if (measureId) {
      this.measureId = +measureId;
      this.getMeasure(Number(measureId));
    }
  }

  getMeasure(measureId: number) {
    this._measureService
      .showMeasure(measureId)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: Measure) => {
          const { measures } = response;

          const form = {
            user: response.user.id,
            comment: response.comment,
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

    const form = this.measureForm.getRawValue();

    const body: MeasureDto = {
      comment: form.comment,
      user: form.user,
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

    const http = this.measureId
      ? this.update(body, this.measureId)
      : this.save(body);

    http.subscribe({
      next: (response: Measure) => {
        const url = `/admin/measures/${response.id}`;
        this._router.navigateByUrl(url);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  save(form: MeasureDto) {
    return this._measureService.saveMeasure(form);
  }

  update(form: MeasureDto, measureId: number) {
    return this._measureService.updateMeasure(measureId, form);
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
