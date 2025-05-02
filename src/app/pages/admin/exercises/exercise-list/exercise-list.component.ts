import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

import { ExerciseList } from 'app/domain';

import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'app-exercise-list',
  standalone: true,
  imports: [
    TableModule,
    TooltipModule,
    TranslocoDirective,
    ConfirmDialogModule,
    DatePipe,
    RouterLink,
  ],
  providers: [ConfirmationService],
  templateUrl: './exercise-list.component.html',
  styleUrl: './exercise-list.component.scss',
})
export class ExerciseListComponent {
  private readonly _confirmationService = inject(ConfirmationService);

  @Input() data!: ExerciseList;
  @Output() deleteChange: EventEmitter<any> = new EventEmitter<any>();

  handleDelete(id: number, index: number) {
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
        this.deleteChange.emit({
          index: index,
          id: id,
        });
      },
    });
  }
}
