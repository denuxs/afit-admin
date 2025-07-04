import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { Observable } from 'rxjs';

import { CatalogList } from 'app/domain';
import { CatalogService } from 'app/services';

import { ProgressSpinner } from 'primeng/progressspinner';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import {
  DialogService,
  DynamicDialog,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { TranslocoDirective } from '@jsverse/transloco';

import { CatalogsFormComponent } from './catalogs-form/catalogs-form.component';
import { CatalogFilterComponent } from './catalog-filter/catalog-filter.component';
import { PrimeAvatarComponent } from 'app/components/prime-avatar/prime-avatar.component';
import { PrimeTableComponent } from 'app/components/prime-table/prime-table.component';

interface Params {
  search?: string;
  ordering?: string;
  key?: string;
  page?: number;
}

@Component({
  selector: 'app-catalogs',
  standalone: true,
  imports: [
    AsyncPipe,
    ProgressSpinner,
    CatalogFilterComponent,
    PaginatorModule,
    TableModule,
    TooltipModule,
    TranslocoDirective,
    ToastModule,
    ConfirmDialogModule,
    PrimeTableComponent,
  ],
  providers: [DialogService, ConfirmationService, MessageService],
  templateUrl: './catalogs.component.html',
  styleUrl: './catalogs.component.scss',
})
export class CatalogsComponent implements OnInit {
  private readonly _confirmationService = inject(ConfirmationService);
  private readonly _messageService = inject(MessageService);
  private readonly _dialogService = inject(DialogService);

  private readonly _catalogService = inject(CatalogService);

  catalogs$!: Observable<CatalogList>;
  ref: DynamicDialogRef | undefined;

  categories = [
    {
      name: 'Musculo',
      id: 'muscle',
    },
    {
      name: 'Equipo',
      id: 'equipment',
    },
  ];

  first = 0;
  rows = 10;
  filters: Params = {
    search: '',
    ordering: '',
    key: '',
    page: 1,
  };

  columns: any[] = [
    { field: 'name', header: 'Nombre', avatar: true, date: false },
    { field: 'created', header: 'Creado', avatar: false, date: true },
  ];

  ngOnInit(): void {
    const params = this.getParams();
    this.loadData(params);
  }

  loadData(params: Params): void {
    this.catalogs$ = this._catalogService.search(params);
  }

  handlePage(event: PaginatorState) {
    const limit = event.rows ?? 0;
    this.first = event.first ?? 0;
    const page = this.first / limit + 1;

    const params = this.getParams();
    const filter = this.filters;

    params.page = page;
    params.search = filter.search;
    params.key = filter.key;
    this.loadData(params);
  }

  handleFilter(filters: Params) {
    this.filters = filters;

    const params = this.getParams();
    Object.assign(params, filters);

    this.loadData(params);
  }

  openCreateDialog(): void {
    this.ref = this._dialogService.open(CatalogsFormComponent, {
      header: 'Crear Catálogo',
      modal: true,
      position: 'top',
      closable: true,
      dismissableMask: true,
      data: {
        categories: this.categories,
      },
    });

    this.ref.onClose.subscribe((data: any) => {
      if (data) {
        const params = this.getParams();
        this.loadData(params);
      }
    });
  }

  openEditDialog(catalog: number): void {
    this.ref = this._dialogService.open(CatalogsFormComponent, {
      header: 'Actualizar Catálogo',
      modal: true,
      position: 'top',
      closable: true,
      dismissableMask: true,
      data: {
        categories: this.categories,
        catalog: catalog,
      },
    });

    this.ref.onClose.subscribe((data: any) => {
      if (data) {
        const params = this.getParams();
        this.loadData(params);
      }
    });
  }

  confirmDelete(id: number) {
    this._confirmationService.confirm({
      message: '¿Está seguro de borrar este catálogo?',
      header: 'Eliminar',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancel',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Borrar',
        severity: 'danger',
      },
      accept: () => {
        this.handleDelete(id);
      },
    });
  }

  handleDelete(id: number) {
    this._catalogService.delete(id).subscribe({
      next: () => {
        const params = this.getParams();
        this.loadData(params);
      },
      error: () => {
        this._messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Algunos ejercicios se encuentran asociados a este catálogo',
        });
      },
    });
  }

  getParams(): Params {
    return {
      search: '',
      ordering: '-id',
      key: '',
      page: 1,
    };
  }
}
