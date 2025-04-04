import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';

import { Catalog } from 'app/domain';
import { CatalogService } from 'app/services';

import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-catalogs',
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe,
    RouterLink,
    ReactiveFormsModule,
    TableModule,
    TooltipModule,
  ],
  templateUrl: './catalogs.component.html',
  styleUrl: './catalogs.component.scss',
})
export class CatalogsComponent implements OnInit {
  private readonly _catalogService = inject(CatalogService);
  private readonly _formBuilder = inject(FormBuilder);

  catalogs$!: Observable<Catalog[]>;
  searchControl = new FormControl();

  catalogTypes: any = [
    {
      name: 'Musculo',
      id: 'muscle',
    },
    {
      name: 'Equipo',
      id: 'equipment',
    },
  ];

  filterForm: FormGroup;

  constructor() {
    this.filterForm = this._formBuilder.group({
      search: ['', []],
      key: ['', []],
    });
  }

  ngOnInit(): void {
    this.getCatalogs();
  }

  getCatalogs(params?: { search?: string; key?: string }): void {
    this.catalogs$ = this._catalogService.fetchCatalogs({
      ordering: 'key',
      ...params,
    });
  }

  handleFilter() {
    const params = this.filterForm.value;
    this.getCatalogs(params);
  }
}
