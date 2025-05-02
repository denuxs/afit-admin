import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

import { UserList } from 'app/domain';

import { TranslocoDirective } from '@jsverse/transloco';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { faSolidCircleCheck } from '@ng-icons/font-awesome/solid';
import { TimeAgoPipe } from 'app/pipes/time-ago.pipe';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    TableModule,
    TooltipModule,
    TranslocoDirective,
    ConfirmDialogModule,
    DatePipe,
    RouterLink,
    NgIcon,
    TimeAgoPipe,
  ],
  providers: [ConfirmationService, provideIcons({ faSolidCircleCheck })],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent {
  private readonly _confirmationService = inject(ConfirmationService);

  @Input() data!: UserList;
  @Output() deleteChange: EventEmitter<any> = new EventEmitter<any>();

  handleDelete(id: number, index: number) {
    this._confirmationService.confirm({
      message: '¿Está seguro de borrar este usuario?',
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
