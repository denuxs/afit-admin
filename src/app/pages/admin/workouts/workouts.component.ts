import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { Observable } from 'rxjs';

import { WorkoutList } from 'app/domain';
import { WorkoutService } from 'app/services';

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

interface Params {
  search?: string;
  ordering?: string;
  user?: number;
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

  workouts$!: Observable<WorkoutList>;
  ref: DynamicDialogRef | undefined;

  first = 0;
  rows = 10;
  filters: Params = {
    search: '',
    ordering: '',
    user: 0,
    page: 1,
  };

  ngOnInit(): void {
    const params = this.getParams();
    this.loadData(params);
  }

  loadData(params: Params): void {
    this.workouts$ = this._workoutService.search(params);
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
    // const userId = this.getUserId();
    return {
      search: '',
      ordering: '-id',
      // user: Number(userId),
      page: 1,
    };
  }
}
