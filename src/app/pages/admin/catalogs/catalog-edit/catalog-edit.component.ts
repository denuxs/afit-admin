import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { CatalogService } from 'app/services';
import { Catalog } from 'app/domain';
import { CatalogsFormComponent } from '../catalogs-form/catalogs-form.component';

import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-catalog-edit',
  standalone: true,
  imports: [
    CatalogsFormComponent,
    RouterLink,
    ProgressSpinnerModule,
    AsyncPipe,
  ],
  templateUrl: './catalog-edit.component.html',
  styleUrl: './catalog-edit.component.scss',
})
export class CatalogEditComponent implements OnInit {
  private readonly _route = inject(ActivatedRoute);

  private readonly _catalogService = inject(CatalogService);

  catalog$!: Observable<Catalog>;

  ngOnInit(): void {
    const catalogId = this._route.snapshot.paramMap.get('id');

    if (catalogId) {
      this.getCatalog(Number(catalogId));
    }
  }

  getCatalog(catalogId: number) {
    this.catalog$ = this._catalogService.showCatalog(catalogId);
  }
}
