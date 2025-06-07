import {
  Component,
  inject,
  DestroyRef,
  OnInit,
  OnDestroy,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Observable, Subject, takeUntil } from 'rxjs';

import { Company, User } from 'app/domain';
import { FileUploadComponent } from 'app/components/file-upload/file-upload.component';

import { CheckboxModule } from 'primeng/checkbox';

import { CompanyService, UserService } from 'app/services';
import { PrimeInputComponent } from 'app/components/prime-input/prime-input.component';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PrimeSelectComponent } from 'app/components/prime-select/prime-select.component';
import { AsyncPipe } from '@angular/common';
@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    CheckboxModule,
    FileUploadComponent,
    PrimeInputComponent,
    PrimeSelectComponent,
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
})
export class UserFormComponent implements OnInit, OnDestroy {
  private readonly _formBuilder = inject(FormBuilder);

  private readonly _config = inject(DynamicDialogConfig);
  private readonly _ref = inject(DynamicDialogRef);

  private readonly _userService = inject(UserService);
  private readonly _companyService = inject(CompanyService);
  private readonly _unsubscribeAll: Subject<any> = new Subject<any>();

  userForm: FormGroup;
  user!: User;
  destroyRef = inject(DestroyRef);

  photoField!: File;
  image = 'default.jpg';
  companies$!: Observable<Company[]>;

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
      is_staff: [false, []],
    });

    // this.userForm.patchValue({
    //   password: this.generatePin(),
    // });
  }

  ngOnInit(): void {
    const config = this.getConfig();
    this.getCompanies();

    if (config && 'user' in config) {
      const { user } = config;

      this.user = user;
      this.setFormFields(user);

      if (user.avatar) {
        this.image = user.avatar;
      }
    }
  }

  getConfig() {
    return this._config.data;
  }

  getCompanies(): void {
    const params = {
      ordering: '-id',
      paginator: null,
    };
    this.companies$ = this._companyService.all(params);
  }

  setFormFields(user: User) {
    const form = {
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      company: user.company,
      is_active: user.is_active,
      is_staff: user.is_staff,
      password: '',
      // is_superuser: user.is_superuser,
    };

    this.userForm.patchValue(form);
  }

  generatePin() {
    const min = 0,
      max = 99999;
    return ('0' + (Math.floor(Math.random() * (max - min + 1)) + min)).substr(
      -6
    );
  }

  handleSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const form = this.userForm.value;

    const formData = new FormData();
    formData.append('username', form.username);
    formData.append('first_name', form.first_name);
    formData.append('last_name', form.last_name);
    formData.append('is_active', Number(form.is_active).toString());
    formData.append('is_staff', Number(form.is_staff).toString());
    formData.append('company', Number(form.company).toString());

    if (form.password) {
      formData.append('password', form.password);
    }

    if (this.photoField) {
      formData.append('avatar', this.photoField);
    }

    if (this.user) {
      this.updateUser(this.user.id, formData);
      return;
    }

    this.createUser(formData);
  }

  createUser(form: FormData) {
    this._userService
      .create(form)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: () => {
          this.closeDialog();
        },
        error: errors => this.setFormErrors(errors),
      });
  }

  updateUser(id: number, form: FormData) {
    this._userService
      .update(id, form)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: () => {
          this.closeDialog();
        },
        error: errors => this.setFormErrors(errors),
      });
  }

  closeDialog() {
    this._ref.close(true);
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

    if (this._ref) {
      this._ref.close();
    }
  }
}
