import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { CatalogService } from 'app/services';
import { Catalog } from 'app/domain';

import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'app-catalog-list',
  standalone: true,
  imports: [
    TableModule,
    TooltipModule,
    TranslocoDirective,
    ToastModule,
    ConfirmDialogModule,
    DatePipe,
    RouterLink,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './catalog-list.component.html',
  styleUrl: './catalog-list.component.scss',
})
export class CatalogListComponent {
  private readonly _confirmationService = inject(ConfirmationService);
  private readonly _messageService = inject(MessageService);

  private readonly _catalogService = inject(CatalogService);

  @Input() data: Catalog[] = [];
  @Output() deleteChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  handleDelete(id: number) {
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
        this._catalogService.delete(id).subscribe({
          next: () => {
            this.deleteChange.emit(true);
          },
          error: () => {
            this._messageService.add({
              severity: 'error',
              summary: 'Error',
              detail:
                'Algunos ejercicios se encuentran asociados a este catálogo',
            });
          },
        });
      },
    });
  }
}
