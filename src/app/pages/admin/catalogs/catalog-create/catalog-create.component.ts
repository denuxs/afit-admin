import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { CatalogService } from 'app/services';
import { CatalogsFormComponent } from '../catalogs-form/catalogs-form.component';
import { CatalogDto } from 'app/domain';

@Component({
  selector: 'app-catalog-create',
  standalone: true,
  imports: [CatalogsFormComponent],
  templateUrl: './catalog-create.component.html',
  styleUrl: './catalog-create.component.scss',
})
export class CatalogCreateComponent {
  private readonly _router = inject(Router);

  private readonly _catalogService = inject(CatalogService);
  private readonly _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor() {}

  onFormChange(form: CatalogDto) {
    this._catalogService
      .saveCatalog(form)
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
