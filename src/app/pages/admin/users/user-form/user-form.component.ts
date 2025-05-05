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
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { User } from 'app/domain';
import { FileUploadComponent } from 'app/components/file-upload/file-upload.component';

import { CheckboxModule } from 'primeng/checkbox';

import { UserService } from 'app/services';
import { PrimeInputComponent } from 'app/components/prime-input/prime-input.component';
import { PrimeSelectComponent } from 'app/components/prime-select/prime-select.component';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    CheckboxModule,
    FileUploadComponent,
    PrimeInputComponent,
    PrimeSelectComponent,
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
})
export class UserFormComponent implements OnInit, OnDestroy {
  private readonly _route = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _formBuilder = inject(FormBuilder);

  private readonly _userService = inject(UserService);
  private readonly _unsubscribeAll: Subject<any> = new Subject<any>();

  userForm: FormGroup;
  user!: User;
  destroyRef = inject(DestroyRef);

  photoField!: File;
  image = 'default.jpg';
  title = 'Crear Cliente';

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
      gender: ['', [Validators.required]],
      password: ['', []],
      phone: [0, [Validators.required, Validators.max(99999999)]],
      age: [0, [Validators.required, Validators.max(99)]],
      weight: [0, []],
      height: [0, []],
      experience_level: ['', []],
      is_active: [true, []],
    });

    this.userForm.patchValue({
      password: this.generatePin(),
    });
  }

  ngOnInit(): void {
    const userId = this._route.snapshot.paramMap.get('id');
    if (userId) {
      this.title = 'Editar Cliente';
      this.getUser(Number(userId));
    }
  }

  getUser(userId: number) {
    this._userService
      .get(userId)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (user: User) => {
          this.user = user;

          this.setFormFields(user);
          if (user.photo) {
            this.image = user.photo;
          }
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
      gender: user.gender,
      is_active: user.is_active,
      password: '',
      weight: user.weight,
      height: user.height,
      experience_level: user.experience_level,
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
    formData.append('age', form.age);
    formData.append('phone', form.phone);
    formData.append('first_name', form.first_name);
    formData.append('last_name', form.last_name);
    formData.append('gender', form.gender);
    formData.append('weight', form.weight);
    formData.append('height', form.height);
    formData.append('experience_level', form.experience_level);
    formData.append('is_active', Number(form.is_active).toString());

    if (form.password) {
      formData.append('password', form.password);
    }

    if (this.photoField) {
      formData.append('photo', this.photoField);
    }

    if (this.user) {
      this.updateCatalog(this.user.id, formData);
      return;
    }

    this.createCatalog(formData);
  }

  createCatalog(form: FormData) {
    this._userService
      .create(form)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: () => {
          const url = `/admin/clients`;
          this._router.navigateByUrl(url);
        },
        error: errors => this.setFormErrors(errors),
      });
  }

  updateCatalog(id: number, form: FormData) {
    this._userService
      .update(id, form)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: () => {
          const url = `/admin/clients`;
          this._router.navigateByUrl(url);
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
