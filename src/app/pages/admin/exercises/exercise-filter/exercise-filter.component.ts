import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { map, Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

import { TranslocoDirective } from '@jsverse/transloco';

import { Catalog } from 'app/interfaces';
import { CatalogService } from 'app/services';

import { PrimeInputComponent } from 'app/components/prime-input/prime-input.component';
import { PrimeSelectComponent } from 'app/components/prime-select/prime-select.component';

@Component({
  selector: 'app-exercise-filter',
  standalone: true,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    TranslocoDirective,
    PrimeInputComponent,
    PrimeSelectComponent,
  ],
  templateUrl: './exercise-filter.component.html',
  styleUrl: './exercise-filter.component.scss',
})
export class ExerciseFilterComponent implements OnInit {
  private readonly _formBuilder = inject(FormBuilder);

  private readonly _catalogService = inject(CatalogService);

  searchControl = new FormControl();

  filterForm: FormGroup;

  catalogs$!: Observable<Catalog[]>;
  muscles!: Catalog[];
  equipments!: Catalog[];

  @Output() filterChange: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
    this.filterForm = this._formBuilder.group({
      search: ['', []],
      muscle: ['', []],
      equipment: ['', []],
    });
  }

  ngOnInit(): void {
    this.loadCatalogs();
  }

  loadCatalogs(): void {
    const params = {
      ordering: '-id',
      paginator: null,
    };

    this.catalogs$ = this._catalogService.all(params).pipe(
      map((catalogs: Catalog[]) => {
        this.muscles = catalogs.filter(catalog => catalog.key === 'muscle');
        this.equipments = catalogs.filter(
          catalog => catalog.key === 'equipment'
        );

        return catalogs;
      })
    );
  }

  handleFilter() {
    const params = this.filterForm.value;
    this.filterChange.emit(params);
  }
}
