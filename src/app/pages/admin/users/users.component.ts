import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';

import { TableModule } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { ProgressSpinner } from 'primeng/progressspinner';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { ToastModule } from 'primeng/toast';

import { UserFilterComponent } from './user-filter/user-filter.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserService } from 'app/services';
import { UserList } from 'app/domain';

interface Params {
  search?: string;
  ordering?: string;
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
    UserListComponent,
    PaginatorModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  private readonly _messageService = inject(MessageService);

  private readonly _userService = inject(UserService);

  users$!: Observable<UserList>;

  first = 0;
  rows = 10;
  filters: Params = {
    search: '',
    ordering: '',
    page: 1,
  };

  ngOnInit(): void {
    const params = this.getParams();

    this.fetchData(params);
  }

  fetchData(params: Params): void {
    this.users$ = this._userService.getUsers(params);
  }

  handlePage(event: PaginatorState) {
    const limit = event.rows ?? 0;
    this.first = event.first ?? 0;
    const page = this.first / limit + 1;

    const params = this.getParams();
    Object.assign(params, this.filters);
    params.page = page;
    this.fetchData(params);
  }

  handleFilter(filters: Params) {
    this.filters = filters;

    const params = this.getParams();
    Object.assign(params, filters);

    this.fetchData(params);
  }

  handleDelete(event: { id: number; index: number }) {
    if (!event.id) {
      return;
    }

    this._userService.delete(event.id).subscribe({
      next: () => {
        const params = this.getParams();
        this.fetchData(params);
      },
      error: () => {
        this._messageService.add({
          severity: 'error',
          summary: 'Error',
          detail:
            'Algunas rutinas,medidas o notificaciones se encuentran asociados a este usuario',
        });
      },
    });
  }

  getParams(): Params {
    return {
      search: '',
      ordering: '-id',
      page: 1,
    };
  }
}
