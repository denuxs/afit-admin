import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { Observable } from 'rxjs';

import { WorkoutList } from 'app/domain';
import { WorkoutService } from 'app/services';

import { TableModule } from 'primeng/table';
import { ProgressSpinner } from 'primeng/progressspinner';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { faSolidCircleCheck } from '@ng-icons/font-awesome/solid';

import { TranslocoDirective } from '@jsverse/transloco';
import { ActivatedRoute, RouterLink } from '@angular/router';

interface Params {
  search?: string;
  user?: number;
  ordering?: string;
  page?: number;
}
@Component({
  selector: 'app-routines',
  standalone: true,
  imports: [
    AsyncPipe,
    TableModule,
    ProgressSpinner,
    ConfirmDialogModule,
    TooltipModule,
    PaginatorModule,
    ToastModule,
    RouterLink,
    NgIcon,
    DatePipe,
    TranslocoDirective,
  ],
  providers: [
    MessageService,
    ConfirmationService,
    provideIcons({ faSolidCircleCheck }),
  ],
  templateUrl: './routines.component.html',
  styleUrl: './routines.component.scss',
})
export class RoutinesComponent implements OnInit {
  private readonly _route = inject(ActivatedRoute);
  private readonly _confirmationService = inject(ConfirmationService);

  private readonly _workoutService = inject(WorkoutService);

  workoust$!: Observable<WorkoutList>;

  first = 0;
  rows = 10;
  filters: Params = {
    search: '',
    ordering: '',
    page: 1,
  };
  userId!: number;

  ngOnInit(): void {
    const userId = this._route.snapshot.paramMap.get('userid');
    if (userId) {
      this.userId = +userId;
    }

    const params = this.getParams();
    this.loadData(params);
  }

  loadData(params: Params): void {
    this.workoust$ = this._workoutService.search(params);
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
    return {
      search: '',
      user: this.userId,
      ordering: 'day',
      page: 1,
    };
  }
}
