import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { Observable, of } from 'rxjs';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { User } from 'app/domain';
import { UserService } from 'app/services';
import { YesNoPipe } from 'app/pipes/yes-no.pipe';

import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TimeAgoPipe } from 'app/pipes/time-ago.pipe';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { faSolidCircleCheck } from '@ng-icons/font-awesome/solid';

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
    TagModule,
    ProgressSpinnerModule,
    TimeAgoPipe,
    NgIcon,
  ],
  providers: [provideIcons({ faSolidCircleCheck })],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _userService = inject(UserService);

  users$: Observable<User[]> = of([]);

  filterForm: FormGroup = this._formBuilder.group({
    search: ['', []],
  });

  constructor() {}

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

  handleDelete(id: number) {
    if (confirm('¿Está seguro de borrar este usuario?')) {
      this._userService.delete(id).subscribe(() => {
        this.getUsers({ search: '' });
      });
    }
    return;
  }
}
