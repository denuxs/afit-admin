import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { User, UserDto } from 'app/domain';
import { UserService } from 'app/services';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
})
export class UserFormComponent implements OnInit {
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  private readonly _formBuilder = inject(FormBuilder);

  private readonly _userService = inject(UserService);
  private readonly _unsubscribeAll: Subject<any> = new Subject<any>();

  userForm: FormGroup;

  constructor() {
    this.userForm = this._formBuilder.group({
      username: ['', [Validators.required]],
      // email: ['', [Validators.required]],
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      password: ['', [Validators.required]],
      phone: [0, [Validators.required]],
      age: [0, [Validators.required]],
      is_active: [true, []],
      // is_superuser: ['', []],
    });
  }

  ngOnInit(): void {
    const userId = this._route.snapshot.paramMap.get('id');

    if (userId) {
      this.getUser(+userId);
    }
  }

  getUser(userId: number) {
    this._userService
      .getUser(userId)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (user: User) => {
          const form = {
            username: user.username,
            phone: user.phone,
            age: user.age,
            first_name: user.first_name,
            last_name: user.last_name,
            is_active: user.is_active,
            // is_superuser: user.is_superuser,
          };

          this.userForm.patchValue(form);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  handleSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const {
      username,
      age,
      phone,
      password,
      first_name,
      last_name,
      is_active,
      is_superuser,
    } = this.userForm.value;

    const form: UserDto = {
      username,
      age,
      phone,
      password,
      first_name,
      last_name,
      is_active,
      is_superuser,
    };

    this._userService
      .saveUser(form)
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

  checkErrors(field: string): string {
    const form: any = this.userForm.get(field);

    if (form.invalid && (form.dirty || form.touched)) {
      if (form?.hasError('required')) {
        return 'Value is required';
      }

      // if (form?.hasError('email')) {
      //   return 'Value is invalid';
      // }
    }
    return '';
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
