import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AsyncPipe } from '@angular/common';

import { UserService } from 'app/services';
import { User } from 'app/domain';

import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { UserFormComponent } from '../user-form/user-form.component';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [UserFormComponent, AsyncPipe, ProgressSpinnerModule],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.scss',
})
export class UserEditComponent implements OnInit {
  private readonly _route = inject(ActivatedRoute);
  private readonly _router = inject(Router);

  private readonly _userService = inject(UserService);
  private readonly _unsubscribeAll: Subject<any> = new Subject<any>();

  user$!: Observable<User>;
  userId: number = 0;

  ngOnInit(): void {
    const userId = this._route.snapshot.paramMap.get('id');

    if (userId) {
      this.userId = Number(userId);
      this.getUser(this.userId);
    }
  }

  getUser(userId: number) {
    this.user$ = this._userService.getUser(userId);
  }

  onFormChange(form: FormData) {
    this._userService
      .updateUser(this.userId, form)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: () => {
          this._router.navigateByUrl('/admin/users');
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
