import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { Observable, Subject, takeUntil } from 'rxjs';

import { Client, Measure } from 'app/domain';
import { ClientService, MeasuresService } from 'app/services';

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
import { MeasureFormComponent } from './measure-form/measure-form.component';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { faSolidCircleCheck } from '@ng-icons/font-awesome/solid';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-measures',
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe,
    RouterLink,
    TableModule,
    ProgressSpinner,
    PaginatorModule,
    ToastModule,
    ConfirmDialogModule,
    TooltipModule,
    TranslocoDirective,
    NgIcon,
  ],
  providers: [
    MessageService,
    ConfirmationService,
    DialogService,
    provideIcons({ faSolidCircleCheck }),
  ],
  templateUrl: './measures.component.html',
  styleUrl: './measures.component.scss',
})
export class MeasuresComponent implements OnInit {
  private readonly _route = inject(ActivatedRoute);
  private readonly _confirmationService = inject(ConfirmationService);
  private readonly _messageService = inject(MessageService);
  private readonly _dialogService = inject(DialogService);

  private readonly _clientService = inject(ClientService);
  private readonly _measuresService = inject(MeasuresService);

  private readonly _unsubscribeAll: Subject<any> = new Subject<any>();

  measures$!: Observable<Measure[]>;
  client!: Client;
  avatar = 'default.jpg';

  ref: DynamicDialogRef | undefined;

  ngOnInit(): void {
    this.loadData();

    const client = this.getClientId();
    this.getClient(Number(client));
  }

  getClientId(): string | null {
    return this._route.snapshot.paramMap.get('id');
  }

  getClient(cliendId: number) {
    this._clientService
      .get(cliendId)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (client: Client) => {
          this.client = client;
          if (client.user.avatar) {
            this.avatar = client.user.avatar;
          }
        },
      });
  }

  loadData(): void {
    const clientId = this.getClientId();
    this.measures$ = this._clientService.measures(Number(clientId));
  }

  openCreateDialog(): void {
    const cliendId = this.getClientId();

    this.ref = this._dialogService.open(MeasureFormComponent, {
      header: 'Crear Medidas',
      modal: true,
      position: 'top',
      styleClass: 'w-1/2',
      closable: true,
      data: {
        client: Number(cliendId),
      },
    });

    this.ref.onClose.subscribe((data: any) => {
      if (data) {
        this.loadData();
      }
    });
  }

  openEditDialog(measure: Measure): void {
    const cliendId = this.getClientId();

    this.ref = this._dialogService.open(MeasureFormComponent, {
      header: 'Actualizar Medidas',
      modal: true,
      position: 'top',
      styleClass: 'w-1/2',
      closable: true,
      data: {
        measure: measure,
        client: Number(cliendId),
      },
    });

    this.ref.onClose.subscribe((data: any) => {
      if (data) {
        this.loadData();
      }
    });
  }

  confirmDelete(id: number) {
    this._confirmationService.confirm({
      message: '¿Está seguro de borrar esta medida?',
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
    this._measuresService.delete(id).subscribe({
      next: () => {
        this.loadData();
      },
      error: () => {},
    });
  }
}
