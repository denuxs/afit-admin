import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { forkJoin, Subject, takeUntil } from 'rxjs';

import { UserFormComponent } from '../user-form/user-form.component';

import { CompanyService } from 'app/services';
import { UserService } from 'app/core';
import { Company, User } from 'app/interfaces';

import { ProgressSpinner } from 'primeng/progressspinner';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [RouterLink, UserFormComponent, ProgressSpinner],
  templateUrl: './user-create.component.html',
  styleUrl: './user-create.component.scss',
})
export class UserCreateComponent implements OnInit {
  private readonly _router = inject(Router);

  private readonly _companyService = inject(CompanyService);
  private readonly _userService = inject(UserService);

  private readonly _unsubscribeAll: Subject<any> = new Subject<any>();

  loading = false;
  companies: Company[] = [];
  coaches: User[] = [];
  errors: any = {};

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.loading = true;

    const params = {
      ordering: '-id',
      paginator: null,
    };
    const companies$ = this._companyService.all(params);

    const params2 = {
      ordering: '-id',
      paginator: null,
      role: 'coach',
    };
    const coaches$ = this._userService.all(params2);

    forkJoin([coaches$, companies$])
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: ([coaches, companies]) => {
          this.companies = companies;
          this.coaches = coaches;
          this.loading = false;
        },
      });
  }

  handleSubmit($event: any) {
    const form = $event;

    this._userService
      .create(form)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: () => {
          const url = `/admin/users`;
          this._router.navigateByUrl(url);
        },
        error: (err: HttpErrorResponse) => this.handleError(err),
      });
  }

  handleError(err: HttpErrorResponse) {
    const { error } = err;
    this.errors = error;
  }
}
