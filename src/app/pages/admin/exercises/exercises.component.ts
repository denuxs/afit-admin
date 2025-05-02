import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';

import { Catalog, CatalogList, ExerciseList } from 'app/domain';
import { CatalogService, ExerciseService } from 'app/services';

import { TableModule } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { ProgressSpinner } from 'primeng/progressspinner';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { ToastModule } from 'primeng/toast';

import { ExerciseFilterComponent } from './exercise-filter/exercise-filter.component';
import { ExerciseListComponent } from './exercise-list/exercise-list.component';

interface Params {
  search?: string;
  ordering?: string;
  muscle?: string;
  equipment?: string;
  page?: number;
}

@Component({
  selector: 'app-exercises',
  standalone: true,
  imports: [
    AsyncPipe,
    TableModule,
    ExerciseFilterComponent,
    ProgressSpinner,
    ExerciseListComponent,
    PaginatorModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './exercises.component.html',
  styleUrl: './exercises.component.scss',
})
export class ExercisesComponent implements OnInit {
  private readonly _messageService = inject(MessageService);

  private readonly _exerciseService = inject(ExerciseService);
  private readonly _catalogService = inject(CatalogService);

  exercises$!: Observable<ExerciseList>;

  muscles!: Catalog[];
  equipments!: Catalog[];

  first = 0;
  rows = 10;
  filters: Params = {
    search: '',
    ordering: '',
    muscle: '',
    equipment: '',
    page: 1,
  };

  ngOnInit(): void {
    const params = this.getParams();

    this.fetchCatalogs();
    this.fetchData(params);
  }

  fetchData(params: Params): void {
    this.exercises$ = this._exerciseService.fetchExercises(params);
  }

  fetchCatalogs(): void {
    const params = {
      ordering: '-id',
    };
    this._catalogService.fetchCatalogs(params).subscribe({
      next: (catalogs: CatalogList) => {
        const { results } = catalogs;
        this.muscles = results.filter(catalog => catalog.key === 'muscle');
        this.equipments = results.filter(
          catalog => catalog.key === 'equipment'
        );
      },
    });
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

    this._exerciseService.delete(event.id).subscribe({
      next: () => {
        const params = this.getParams();
        this.fetchData(params);
      },
      error: () => {
        this._messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Algunas rutinas se encuentran asociados a este ejercicio',
        });
      },
    });
  }

  getParams(): Params {
    return {
      search: '',
      ordering: '-id',
      muscle: '',
      equipment: '',
      page: 1,
    };
  }
}
