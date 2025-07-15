import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { Observable } from 'rxjs';

import { Exercise, ExerciseList } from 'app/interfaces';
import { ExerciseService } from 'app/services';

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

import { ExerciseFilterComponent } from './exercise-filter/exercise-filter.component';
import { ExerciseFormComponent } from './exercise-form/exercise-form.component';
import { PrimeAvatarComponent } from 'app/components/prime-avatar/prime-avatar.component';

interface Params {
  search?: string;
  ordering?: string;
  muscle?: string;
  equipment?: string;
  page?: number;
}

@Component({
  selector: 'app-exercises',
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe,
    TableModule,
    ExerciseFilterComponent,
    ProgressSpinner,
    PaginatorModule,
    ToastModule,
    ConfirmDialogModule,
    TooltipModule,
    TranslocoDirective,
    PrimeAvatarComponent,
  ],
  providers: [MessageService, ConfirmationService, DialogService],
  templateUrl: './exercises.component.html',
  styleUrl: './exercises.component.scss',
})
export class ExercisesComponent implements OnInit {
  private readonly _confirmationService = inject(ConfirmationService);
  private readonly _messageService = inject(MessageService);
  private readonly _dialogService = inject(DialogService);

  private readonly _exerciseService = inject(ExerciseService);

  exercises$!: Observable<ExerciseList>;
  ref: DynamicDialogRef | undefined;

  first = 0;
  rows = 10;
  filters: Params = {
    search: '',
    ordering: '',
    muscle: '',
    equipment: '',
    page: 1,
  };

  ngOnInit(): void {
    const params = this.getParams();

    this.loadData(params);
  }

  loadData(params: Params): void {
    this.exercises$ = this._exerciseService.search(params);
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
    this.ref = this._dialogService.open(ExerciseFormComponent, {
      header: 'Crear Ejercicio',
      modal: true,
      position: 'top',
      closable: true,
      dismissableMask: true,
    });

    this.ref.onClose.subscribe((data: any) => {
      if (data) {
        const params = this.getParams();
        this.loadData(params);
      }
    });
  }

  openEditDialog(exercise: Exercise): void {
    this.ref = this._dialogService.open(ExerciseFormComponent, {
      header: 'Actualizar Ejercicio',
      modal: true,
      position: 'top',
      closable: true,
      dismissableMask: true,
      data: {
        exercise: exercise,
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
      message: '¿Está seguro de borrar este ejercicio?',
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
    this._exerciseService.delete(id).subscribe({
      next: () => {
        const params = this.getParams();
        this.loadData(params);
      },
      error: () => {
        this._messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Algunas rutinas se encuentran asociados a este ejercicio',
        });
      },
    });
  }

  getParams(): Params {
    return {
      search: '',
      ordering: '-id',
      muscle: '',
      equipment: '',
      page: 1,
    };
  }
}
