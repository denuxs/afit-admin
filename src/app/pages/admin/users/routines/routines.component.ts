import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

import { Workout } from 'app/domain';
import { WorkoutService } from 'app/services';
import { YesNoPipe } from 'app/pipes/yes-no.pipe';

import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';

import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { faSolidCircleCheck } from '@ng-icons/font-awesome/solid';
@Component({
  selector: 'app-routines',
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe,
    ReactiveFormsModule,
    RouterLink,
    TableModule,
    TooltipModule,
    YesNoPipe,
    TagModule,
    NgIcon,
    ToastModule,
    ConfirmDialogModule,
  ],
  providers: [ConfirmationService, provideIcons({ faSolidCircleCheck })],
  templateUrl: './routines.component.html',
  styleUrl: './routines.component.scss',
})
export class RoutinesComponent implements OnInit {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _route = inject(ActivatedRoute);
  private readonly _workoutService = inject(WorkoutService);

  private readonly _confirmationService = inject(ConfirmationService);

  workoust$!: Observable<Workout[]>;

  filterForm: FormGroup;

  days = [
    'Lunes',
    'Martes',
    'Miercoles',
    'Jueves',
    'Viernes',
    'Sabado',
    'Domingo',
  ];
  userId!: number;

  constructor() {
    this.filterForm = this._formBuilder.group({
      search: ['', []],
    });
  }

  ngOnInit(): void {
    const userId = this._route.snapshot.paramMap.get('userId');
    if (userId) {
      this.userId = +userId;
      const params = { user: this.userId, search: '' };
      this.getWorkouts(params);
    }
  }

  getWorkouts(params: any): void {
    this.workoust$ = this._workoutService.fetchWorkouts(params);
  }

  handleFilter() {
    const { search } = this.filterForm.value;

    const params = { user: this.userId, search };
    this.getWorkouts(params);
  }

  getDay(day: number): string {
    return this.days[day - 1];
  }

  handleDelete(id: number) {
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
        this._workoutService.delete(id).subscribe({
          next: () => {
            const params = { user: this.userId, search: '' };
            this.getWorkouts(params);
          },
        });
      },
    });
  }
}
