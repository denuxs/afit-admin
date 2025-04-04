import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { MeasureImagesComponent } from '../measure-images/measure-images.component';
import { MeasureFormComponent } from '../measure-form/measure-form.component';

import { MeasuresService } from 'app/services';
import { Measure, MeasureDto } from 'app/domain';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-measure-edit',
  standalone: true,
  imports: [
    MeasureFormComponent,
    MeasureImagesComponent,
    ProgressSpinnerModule,
  ],
  templateUrl: './measure-edit.component.html',
  styleUrl: './measure-edit.component.scss',
})
export class MeasureEditComponent implements OnInit {
  private readonly _route = inject(ActivatedRoute);
  private readonly _router = inject(Router);

  private readonly _measureService = inject(MeasuresService);
  private readonly _unsubscribeAll: Subject<any> = new Subject<any>();

  measure!: any;
  measureId: number = 0;
  loading: boolean = false;

  ngOnInit(): void {
    const measureId = this._route.snapshot.paramMap.get('id');
    if (measureId) {
      this.measureId = +measureId;
      this.getMeasure(Number(measureId));
    }
  }

  getMeasure(measureId: number) {
    this.loading = true;
    this._measureService
      .showMeasure(measureId)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: Measure) => {
          const { measures } = response;
          const form = {
            user: response.user.id,
            comment: response.comment,
            is_active: response.is_active,
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

          this.measure = form;
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          console.log(err);
        },
      });
  }

  onFormChange(form: MeasureDto) {
    this._measureService.updateMeasure(this.measureId, form).subscribe({
      next: (response: Measure) => {
        const url = `/admin/measures`;
        this._router.navigateByUrl(url);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
