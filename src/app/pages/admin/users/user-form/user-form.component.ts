import { Component, inject, DestroyRef, OnInit } from '@angular/core';
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
import { withRequestsMadeViaParent } from '@angular/common/http';
import { Password } from 'primeng/password';

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
  photoPreview: string = 'https://placehold.co/200x160';
  photoField!: File;
  userId: string | null = null;
  destroyRef = inject(DestroyRef);

  constructor() {
    this.userId = this._route.snapshot.paramMap.get('id');

    this.userForm = this._formBuilder.group({
      username: ['', [Validators.required]],
      // email: ['', [Validators.required]],
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      password: ['', [Validators.required]],
      phone: [0, [Validators.required, Validators.max(99999999)]],
      age: [0, [Validators.required, Validators.max(99)]],
      is_active: [true, []],
      // is_superuser: ['', []],
    });

    this.userForm.patchValue({
      password: this.generatePin(),
    });
  }

  ngOnInit(): void {
    if (this.userId) {
      this.getUser(Number(this.userId));
    }
  }

  getUser(userId: number) {
    this._userService
      .getUser(userId)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (user: User) => {
          this.setFormFields(user);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  setFormFields(user: User) {
    const form = {
      username: user.username,
      phone: user.phone,
      age: user.age,
      first_name: user.first_name,
      last_name: user.last_name,
      is_active: user.is_active,
      password: null,
      // is_superuser: user.is_superuser,
    };

    this.userForm.patchValue(form);
    this.photoPreview = user.photo;
  }

  generatePin() {
    const min = 0,
      max = 99999;
    return ('0' + (Math.floor(Math.random() * (max - min + 1)) + min)).substr(
      -6,
    );
  }

  handleSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const form = this.userForm.getRawValue();

    this.saveUser(form);
  }

  saveUser(user: UserDto): void {
    const formData = new FormData();
    formData.append('username', user.username);
    formData.append('age', user.age);
    formData.append('phone', user.phone);
    formData.append('password', user.password);
    formData.append('first_name', user.first_name);
    formData.append('last_name', user.last_name);
    formData.append('is_active', Number(user.is_active).toString());

    if (this.photoField) {
      formData.append('photo', this.photoField);
    }

    let form = this._userService.saveUser(formData);
    if (this.userId) {
      form = this._userService.updateUser(Number(this.userId), formData);
    }

    form.pipe(takeUntil(this._unsubscribeAll)).subscribe({
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

      if (form?.hasError('max')) {
        return 'Value is invalid';
      }
    }
    return '';
  }

  uploadImage(event: any): void {
    const file: File = event.target.files[0];
    if (!file) {
      return;
    }

    this.photoField = file;

    this._readAsDataURL(file).then((data) => {
      this.photoPreview = data;
    });
  }

  private _readAsDataURL(file: File): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (): void => {
        resolve(reader.result);
      };

      reader.onerror = (e): void => {
        reject(e);
      };

      reader.readAsDataURL(file);
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
