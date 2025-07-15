import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';

import { TableModule } from 'primeng/table';
import { ProgressSpinner } from 'primeng/progressspinner';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';

import { UserService } from 'app/core';
import { UserList } from 'app/interfaces';

import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  faSolidCircleCheck,
  faSolidDumbbell,
  faSolidPenToSquare,
} from '@ng-icons/font-awesome/solid';

import { TimeAgoPipe } from 'app/pipes/time-ago.pipe';
import { PrimeAvatarComponent } from 'app/components/prime-avatar/prime-avatar.component';
import { UserFilterComponent } from './user-filter/user-filter.component';
interface Params {
  search?: string;
  ordering?: string;
  // role__in: string;
  page?: number;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    AsyncPipe,
    TableModule,
    UserFilterComponent,
    ProgressSpinner,
    PaginatorModule,
    TooltipModule,
    ConfirmDialogModule,
    ToastModule,
    NgIcon,
    TimeAgoPipe,
    DatePipe,
    PrimeAvatarComponent,
    RouterLink,
  ],
  providers: [
    MessageService,
    ConfirmationService,
    provideIcons({ faSolidCircleCheck, faSolidPenToSquare, faSolidDumbbell }),
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  private readonly _confirmationService = inject(ConfirmationService);
  private readonly _messageService = inject(MessageService);

  private readonly _userService = inject(UserService);

  users$!: Observable<UserList>;

  first = 0;
  rows = 10;
  filters: Params = {
    search: '',
    ordering: '',
    page: 1,
    // role__in: 'client',
  };

  ngOnInit(): void {
    const params = this.getParams();

    this.loadData(params);
  }

  loadData(params: Params): void {
    this.users$ = this._userService.search(params);
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
        this.handleDelete(id);
      },
    });
  }

  handleDelete(id: number) {
    this._userService.delete(id).subscribe({
      next: () => {
        const params = this.getParams();
        this.loadData(params);
      },
      error: () => {
        this._messageService.add({
          severity: 'error',
          summary: 'Error',
          detail:
            'Algunas rutinas o medidas se encuentran asociados a este usuario',
        });
      },
    });
  }

  getParams(): Params {
    return {
      search: '',
      // role__in: 'admin, coach',
      ordering: '-id',
      page: 1,
    };
  }
}
