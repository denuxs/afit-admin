import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AsyncPipe } from '@angular/common';

import { CompanyService, UserService } from 'app/services';
import { Company, User } from 'app/domain';

import { MessageService } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';

import { PrimeInputComponent } from 'app/components/prime-input/prime-input.component';
import { PrimeSelectComponent } from 'app/components/prime-select/prime-select.component';
import { PrimePasswordComponent } from 'app/components/prime-password/prime-password.component';
import { FileUploadComponent } from 'app/components/file-upload/file-upload.component';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CheckboxModule,
    AsyncPipe,
    FileUploadComponent,
    PrimeInputComponent,
    PrimeSelectComponent,
    PrimePasswordComponent,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit, OnDestroy {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _messageService = inject(MessageService);

  private readonly _userService = inject(UserService);
  private readonly _companyService = inject(CompanyService);

  private readonly _unsubscribeAll: Subject<any> = new Subject<any>();

  userForm: FormGroup;
  user!: User;

  photoField!: File;
  image = 'default.jpg';
  companies$!: Observable<Company[]>;
  loading = true;

  genders = [
    {
      name: 'Masculino',
      id: 'male',
    },
    {
      name: 'Femenino',
      id: 'female',
    },
  ];

  constructor() {
    this.userForm = this._formBuilder.group({
      username: ['', [Validators.required]],
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      company: ['', [Validators.required]],
      password: ['', []],
      is_active: [true, []],
    });
  }

  ngOnInit(): void {
    this.getCompanies();

    this._userService.user$.subscribe({
      next: (user: User) => {
        this.user = user;

        this.setFormFields(user);
      },
    });
  }

  setFormFields(user: User) {
    const form = {
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      is_active: user.is_active,
      company: user.company,
      password: '',
    };

    this.userForm.patchValue(form);
    this.userForm.get('username')?.disable();
    this.userForm.get('company')?.disable();

    if (user.avatar) {
      this.image = user.avatar;
    }
  }

  getCompanies(): void {
    const params = {
      ordering: '-id',
      paginator: null,
    };
    this.companies$ = this._companyService.all(params);
  }

  handleSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const form = this.userForm.value;

    const formData = new FormData();
    formData.append('first_name', form.first_name);
    formData.append('last_name', form.last_name);
    formData.append('is_active', Number(form.is_active).toString());

    if (form.password) {
      formData.append('password', form.password);
    }

    if (this.photoField) {
      formData.append('avatar', this.photoField);
    }

    if (this.user) {
      this.updateCatalog(this.user.id, formData);
    }
  }

  updateCatalog(id: number, form: FormData) {
    this._userService
      .update(id, form)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (user: User) => {
          this._userService.user = user;
          this._messageService.add({
            severity: 'success',
            // summary: 'Error',
            detail: 'Perfil actualizado',
          });
        },
        error: errors => this.setFormErrors(errors),
      });
  }

  setFormErrors(errors: any) {
    for (const field in errors) {
      if (this.userForm.controls[field]) {
        const control = this.userForm.get(field);
        control?.setErrors({ server: errors[field].join(' ') });
      }
    }

    this.userForm.markAllAsTouched();
  }

  handleFile(file: File): void {
    this.photoField = file;
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
