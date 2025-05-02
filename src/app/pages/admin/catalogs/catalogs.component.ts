import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';

import { Catalog } from 'app/domain';
import { CatalogService } from 'app/services';

import { CatalogListComponent } from './catalog-list/catalog-list.component';
import { CatalogFilterComponent } from './catalog-filter/catalog-filter.component';

import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
  selector: 'app-catalogs',
  standalone: true,
  imports: [
    AsyncPipe,
    ProgressSpinner,
    CatalogListComponent,
    CatalogFilterComponent,
  ],
  providers: [],
  templateUrl: './catalogs.component.html',
  styleUrl: './catalogs.component.scss',
})
export class CatalogsComponent implements OnInit {
  private readonly _catalogService = inject(CatalogService);

  catalogs$!: Observable<Catalog[]>;

  catalogTypes: any = [
    {
      name: 'TODOS',
      id: '',
    },
    {
      name: 'Musculo',
      id: 'muscle',
    },
    {
      name: 'Equipo',
      id: 'equipment',
    },
  ];

  ngOnInit(): void {
    this.getCatalogs();
  }

  getCatalogs(params?: any): void {
    this.catalogs$ = this._catalogService.fetchCatalogs({
      ordering: '-id',
      ...params,
    });
  }

  handleFilter(filters: any) {
    this.getCatalogs(filters);
  }

  handleDelete(event: any) {
    if (event) {
      this.getCatalogs();
    }
  }
}
