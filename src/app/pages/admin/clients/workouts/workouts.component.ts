import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { Observable, Subject, takeUntil } from 'rxjs';

import { Client, Workout, WorkoutList } from 'app/domain';
import { ClientService, WorkoutService } from 'app/services';

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
import { ActivatedRoute, RouterLink } from '@angular/router';

import { faSolidPenToSquare } from '@ng-icons/font-awesome/solid';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { PrimeAvatarComponent } from 'app/components/prime-avatar/prime-avatar.component';
import { WorkoutFormComponent } from './workout-form/workout-form.component';

interface Params {
  search?: string;
  ordering?: string;
  client?: number;
  page?: number;
}
@Component({
  selector: 'app-workouts',
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe,
    ProgressSpinner,
    PaginatorModule,
    TableModule,
    TooltipModule,
    TranslocoDirective,
    ToastModule,
    ConfirmDialogModule,
    RouterLink,
    NgIcon,
    PrimeAvatarComponent,
  ],
  providers: [
    DialogService,
    ConfirmationService,
    MessageService,
    provideIcons({ faSolidPenToSquare }),
  ],
  templateUrl: './workouts.component.html',
  styleUrl: './workouts.component.scss',
})
export class WorkoutsComponent implements OnInit {
  private readonly _route = inject(ActivatedRoute);
  private readonly _confirmationService = inject(ConfirmationService);
  private readonly _messageService = inject(MessageService);
  private readonly _dialogService = inject(DialogService);

  private readonly _workoutService = inject(WorkoutService);
  private readonly _clientService = inject(ClientService);

  private readonly _unsubscribeAll: Subject<any> = new Subject<any>();

  workouts$!: Observable<WorkoutList>;
  ref: DynamicDialogRef | undefined;
  client!: Client;
  avatar = 'default.jpg';

  first = 0;
  rows = 10;
  filters: Params = {
    search: '',
    ordering: '',
    client: 0,
    page: 1,
  };

  ngOnInit(): void {
    const params = this.getParams();
    this.loadData(params);

    const client = this.getClientId();
    this.getClient(Number(client));
  }

  getClientId() {
    return this._route.snapshot.paramMap.get('id');
  }

  loadData(params: Params): void {
    this.workouts$ = this._workoutService.search(params);
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

  handlePage(event: PaginatorState) {
    const limit = event.rows ?? 0;
    this.first = event.first ?? 0;
    const page = this.first / limit + 1;

    const params = this.getParams();
    Object.assign(params, this.filters);
    params.page = page;
    this.loadData(params);
  }

  handleFilter(filters: Params) {
    this.filters = filters;

    const params = this.getParams();
    Object.assign(params, filters);

    this.loadData(params);
  }

  openCreateDialog(): void {
    const client = this.getClientId();

    this.ref = this._dialogService.open(WorkoutFormComponent, {
      header: 'Crear Rutina',
      modal: true,
      position: 'top',
      height: '80vh',
      closable: true,
      data: {
        client: client,
      },
    });

    this.ref.onClose.subscribe((data: any) => {
      if (data) {
        const params = this.getParams();
        this.loadData(params);
      }
    });
  }

  openEditDialog(workout: Workout): void {
    const client = this.getClientId();

    this.ref = this._dialogService.open(WorkoutFormComponent, {
      header: 'Actualizar Rutina',
      modal: true,
      position: 'top',
      closable: true,
      data: {
        client: client,
        workout: workout,
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
      message: '¿Está seguro de borrar esta rutina?',
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
    this._workoutService.delete(id).subscribe({
      next: () => {
        const params = this.getParams();
        this.loadData(params);
      },
      error: () => {},
    });
  }

  getParams(): Params {
    const client = this.getClientId();

    return {
      search: '',
      ordering: '-id',
      client: Number(client),
      page: 1,
    };
  }
}
