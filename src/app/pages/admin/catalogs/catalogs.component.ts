import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';

import { Catalog } from 'app/domain';
import { CatalogService } from 'app/services';

@Component({
  selector: 'app-catalogs',
  standalone: true,
  imports: [NgIf, AsyncPipe, DatePipe, RouterLink],
  templateUrl: './catalogs.component.html',
  styleUrl: './catalogs.component.scss',
})
export class CatalogsComponent implements OnInit {
  private readonly _catalogService = inject(CatalogService);

  catalogs$!: Observable<Catalog[]>;

  ngOnInit(): void {
    this.catalogs$ = this._catalogService.fetchCatalogs({
      ordering: 'key',
    });
  }
}
