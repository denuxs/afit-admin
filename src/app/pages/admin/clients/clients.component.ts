import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';

import { TableModule } from 'primeng/table';
import { ProgressSpinner } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';

import { Client } from 'app/domain';

import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  faSolidCircleCheck,
  faSolidDumbbell,
  faSolidPenToSquare,
} from '@ng-icons/font-awesome/solid';

import { PrimeAvatarComponent } from 'app/components/prime-avatar/prime-avatar.component';
import { ClientService, UserService } from 'app/services';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    AsyncPipe,
    TableModule,
    ProgressSpinner,
    TooltipModule,
    ConfirmDialogModule,
    ToastModule,
    NgIcon,
    DatePipe,
    RouterLink,
    PrimeAvatarComponent,
  ],
  providers: [
    MessageService,
    ConfirmationService,
    provideIcons({ faSolidCircleCheck, faSolidPenToSquare, faSolidDumbbell }),
  ],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss',
})
export class ClientsComponent implements OnInit {
  private readonly _confirmationService = inject(ConfirmationService);
  private readonly _messageService = inject(MessageService);

  private readonly _userService = inject(UserService);
  private readonly _clientService = inject(ClientService);

  clients$!: Observable<Client[]>;

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    const params = {
      ordering: '-id',
      paginator: null,
    };
    this.clients$ = this._clientService.all(params);
  }

  confirmDelete(id: number) {
    this._confirmationService.confirm({
      message: '¿Está seguro de borrar este cliente?',
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
    this._clientService.delete(id).subscribe({
      next: () => {
        this.loadData();
      },
      error: () => {
        this._messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Algunas rutinas se encuentran asociados a este cliente',
        });
      },
    });
  }
}
