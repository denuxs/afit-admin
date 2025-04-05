import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { User } from 'app/domain';
import { UserService } from 'app/services';

import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { YesNoPipe } from 'app/pipes/yes-no.pipe';
@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe,
    ReactiveFormsModule,
    TableModule,
    RouterLink,
    TooltipModule,
    YesNoPipe,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _userService = inject(UserService);

  users$!: Observable<User[]>;

  filterForm: FormGroup;

  constructor() {
    this.filterForm = this._formBuilder.group({
      search: ['', []],
    });
  }

  ngOnInit(): void {
    this.getUsers({ search: '' });
  }

  getUsers(params: { search: string }): void {
    this.users$ = this._userService.getUsers(params);
  }

  handleFilter() {
    const { search } = this.filterForm.value;
    this.getUsers({ search });
  }
}
