import { Component, inject } from '@angular/core';
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
export class MeasureCreateComponent {
  private readonly _router = inject(Router);

  private readonly _measureService = inject(MeasuresService);

  onFormChange(form: MeasureDto) {
    this._measureService.saveMeasure(form).subscribe({
      next: (response: Measure) => {
        const url = `/admin/measures/${response.id}/edit`;
        this._router.navigateByUrl(url);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
