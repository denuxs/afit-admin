import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

import { Catalog, Exercise } from 'app/domain';
import { CatalogService, ExerciseService } from 'app/services';

import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-exercises',
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe,
    ReactiveFormsModule,
    RouterLink,
    TableModule,
    TooltipModule,
  ],
  templateUrl: './exercises.component.html',
  styleUrl: './exercises.component.scss',
})
export class ExercisesComponent implements OnInit {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _exerciseService = inject(ExerciseService);
  private readonly _catalogService = inject(CatalogService);

  exercises$!: Observable<Exercise[]>;
  catalogs$!: Observable<Catalog[]>;

  filterForm: FormGroup;

  muscles: any = [];
  equipments: any = [];

  constructor() {
    this.filterForm = this._formBuilder.group({
      search: ['', []],
      muscle: ['', []],
      equipment: ['', []],
    });
  }

  ngOnInit(): void {
    this.getExercises({});
    this.getCatalogs();
  }

  getExercises(params?: any): void {
    console.log(params);
    params['ordering'] = '-id';
    this.exercises$ = this._exerciseService.fetchExercises(params);
  }

  getCatalogs(): void {
    this._catalogService
      .fetchCatalogs({
        ordering: '-id',
      })
      .subscribe({
        next: (catalogs: Catalog[]) => {
          this.muscles = catalogs.filter(catalog => catalog.key === 'muscle');
          this.equipments = catalogs.filter(
            catalog => catalog.key === 'equipment'
          );
        },
      });
  }

  handleFilter() {
    const params = this.filterForm.value;
    this.getExercises(params);
  }
}
