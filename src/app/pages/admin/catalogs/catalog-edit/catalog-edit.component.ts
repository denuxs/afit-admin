import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AsyncPipe } from '@angular/common';

import { CatalogService } from 'app/services';
import { Catalog, CatalogDto } from 'app/domain';
import { CatalogsFormComponent } from '../catalogs-form/catalogs-form.component';

import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-catalog-edit',
  standalone: true,
  imports: [CatalogsFormComponent, ProgressSpinnerModule, AsyncPipe],
  templateUrl: './catalog-edit.component.html',
  styleUrl: './catalog-edit.component.scss',
})
export class CatalogEditComponent implements OnInit {
  private readonly _route = inject(ActivatedRoute);
  private readonly _router = inject(Router);

  private readonly _catalogService = inject(CatalogService);
  private readonly _unsubscribeAll: Subject<any> = new Subject<any>();

  catalog$!: Observable<Catalog>;
  catalogId: number = 0;

  ngOnInit(): void {
    const catalogId = this._route.snapshot.paramMap.get('id');

    if (catalogId) {
      this.catalogId = Number(catalogId);
      this.getCatalog(this.catalogId);
    }
  }

  getCatalog(catalogId: number) {
    this.catalog$ = this._catalogService.showCatalog(catalogId);
  }

  onFormChange(form: CatalogDto) {
    this._catalogService
      .updateCatalog(this.catalogId, form)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: () => {
          this._router.navigateByUrl('/admin/catalogs');
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
