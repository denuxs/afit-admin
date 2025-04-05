import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Measure } from 'app/domain';
import { MeasuresService } from 'app/services';
import { YesNoPipe } from 'app/pipes/yes-no.pipe';

import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-measures',
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe,
    ReactiveFormsModule,
    RouterLink,
    TableModule,
    TooltipModule,
    YesNoPipe,
  ],
  templateUrl: './measures.component.html',
  styleUrl: './measures.component.scss',
})
export class MeasuresComponent implements OnInit {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _measureService = inject(MeasuresService);

  measures$!: Observable<Measure[]>;

  filterForm: FormGroup;

  constructor() {
    this.filterForm = this._formBuilder.group({
      search: ['', []],
    });
  }

  ngOnInit(): void {
    this.getMeasures({ search: '' });
  }

  getMeasures(params: { search: string }): void {
    this.measures$ = this._measureService.fetchMeasures(params);
  }

  handleFilter(): void {
    const { search } = this.filterForm.value;
    this.getMeasures({ search });
  }
}
