import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Measure, MeasureDto } from 'app/domain';
import { MeasuresService } from 'app/services';
import { MeasureFormComponent } from '../measure-form/measure-form.component';

@Component({
  selector: 'app-measure-create',
  standalone: true,
  imports: [MeasureFormComponent],
  templateUrl: './measure-create.component.html',
  styleUrl: './measure-create.component.scss',
})
export class MeasureCreateComponent implements OnInit {
  private readonly _router = inject(Router);

  private readonly _measureService = inject(MeasuresService);
  private readonly _route = inject(ActivatedRoute);

  userId!: number;

  ngOnInit(): void {
    const userId = this._route.snapshot.paramMap.get('userId');
    if (userId) {
      this.userId = +userId;
    }
  }

  onFormChange(form: MeasureDto) {
    this._measureService.saveMeasure(form).subscribe({
      next: (response: Measure) => {
        const url = `/admin/users/${this.userId}/measures`;
        this._router.navigateByUrl(url);
      },
    });
  }
}
