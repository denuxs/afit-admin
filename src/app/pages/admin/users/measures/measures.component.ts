import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';

import { MeasureList } from 'app/domain';
import { MeasuresService } from 'app/services';

import { TableModule } from 'primeng/table';
import { ProgressSpinner } from 'primeng/progressspinner';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';

import { MeasureListComponent } from './measure-list/measure-list.component';

interface Params {
  search?: string;
  ordering?: string;
  page?: number;
}

@Component({
  selector: 'app-measures',
  standalone: true,
  imports: [
    AsyncPipe,
    TableModule,
    ProgressSpinner,
    PaginatorModule,
    MeasureListComponent,
  ],
  providers: [],
  templateUrl: './measures.component.html',
  styleUrl: './measures.component.scss',
})
export class MeasuresComponent implements OnInit {
  private readonly _measureService = inject(MeasuresService);

  measures$!: Observable<MeasureList>;

  first = 0;
  rows = 10;
  filters: Params = {
    search: '',
    ordering: '',
    page: 1,
  };

  ngOnInit(): void {
    const params = this.getParams();

    this.fetchData(params);
  }

  fetchData(params: Params): void {
    this.measures$ = this._measureService.fetchMeasures(params);
  }

  handlePage(event: PaginatorState) {
    const limit = event.rows ?? 0;
    this.first = event.first ?? 0;
    const page = this.first / limit + 1;

    const params = this.getParams();
    Object.assign(params, this.filters);
    params.page = page;
    this.fetchData(params);
  }

  handleFilter(filters: Params) {
    this.filters = filters;

    const params = this.getParams();
    Object.assign(params, filters);

    this.fetchData(params);
  }

  handleDelete(event: { id: number; index: number }) {
    if (!event.id) {
      return;
    }

    this._measureService.delete(event.id).subscribe({
      next: () => {
        const params = this.getParams();
        this.fetchData(params);
      },
      error: () => {},
    });
  }

  getParams(): Params {
    return {
      search: '',
      ordering: '-id',
      page: 1,
    };
  }
}
