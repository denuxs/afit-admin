import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subject, forkJoin, takeUntil } from 'rxjs';

import { UserService } from 'app/core';
import { Company, User } from 'app/interfaces';

import { UserFormComponent } from '../user-form/user-form.component';
import { CompanyService } from 'app/services';

import { ProgressSpinner } from 'primeng/progressspinner';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [RouterLink, UserFormComponent, ProgressSpinner],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.scss',
})
export class UserEditComponent implements OnInit {
  private readonly _route = inject(ActivatedRoute);
  private readonly _router = inject(Router);

  private readonly _companyService = inject(CompanyService);
  private readonly _userService = inject(UserService);

  private readonly _unsubscribeAll: Subject<any> = new Subject<any>();

  user!: User;

  loading = false;
  companies: Company[] = [];
  coaches: User[] = [];
  errors: any = {};

  ngOnInit(): void {
    const userId = this._route.snapshot.paramMap.get('id');

    if (userId) {
      this.getData(Number(userId));
    }
  }

  getData(userId: number): void {
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

    const user$ = this._userService.get(userId);

    forkJoin([user$, coaches$, companies$])
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: ([user, coaches, companies]) => {
          this.user = user;
          this.companies = companies;
          this.coaches = coaches;
          this.loading = false;
        },
      });
  }

  handleSubmit($event: any) {
    const form = $event;
    const userId = this.user.id;

    this._userService
      .update(userId, form)
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
