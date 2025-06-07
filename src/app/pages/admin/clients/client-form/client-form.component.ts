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
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { Client, User } from 'app/domain';
import { FileUploadComponent } from 'app/components/file-upload/file-upload.component';

import { CheckboxModule } from 'primeng/checkbox';

import { PrimeInputComponent } from 'app/components/prime-input/prime-input.component';
import { PrimeSelectComponent } from 'app/components/prime-select/prime-select.component';
import { ClientService, UserService } from 'app/services';
import { AsyncPipe } from '@angular/common';
import { is } from 'date-fns/locale';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    AsyncPipe,
    CheckboxModule,
    FileUploadComponent,
    PrimeInputComponent,
    PrimeSelectComponent,
  ],
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.scss',
})
export class ClientFormComponent implements OnInit, OnDestroy {
  private readonly _route = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _formBuilder = inject(FormBuilder);

  private readonly _clientService = inject(ClientService);
  private readonly _userService = inject(UserService);

  private readonly _unsubscribeAll: Subject<any> = new Subject<any>();

  clientForm: FormGroup;
  client!: Client;
  destroyRef = inject(DestroyRef);

  photoField!: File;
  image = 'default.jpg';
  title = 'Crear Cliente';

  coaches$!: Observable<User[]>;

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
    this.clientForm = this._formBuilder.group({
      username: ['', [Validators.required]],
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      password: ['', Validators.required],
      is_active: [true, []],
      gender: ['', [Validators.required]],
      coach: ['', [Validators.required]],
      phone: [0, [Validators.required, Validators.max(99999999)]],
      age: [0, [Validators.required, Validators.max(99)]],
      weight: [0, []],
      height: [0, []],
      experience_level: ['', Validators.required],
    });

    // this.clientForm.patchValue({
    //   password: this.generatePin(),
    // });
  }

  ngOnInit(): void {
    const clientId = this._route.snapshot.paramMap.get('id');

    this.getCoaches();

    if (clientId) {
      this.title = 'Editar Cliente';
      this.getClient(Number(clientId));
    }
  }

  getClient(cliendId: number) {
    this._clientService
      .get(cliendId)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (client: Client) => {
          this.client = client;

          this.setFormFields(client);
          if (client.user.avatar) {
            this.image = client.user.avatar;
          }
        },
      });
  }

  getCoaches(): void {
    const params = {
      ordering: '-id',
      paginator: null,
      is_staff: true,
      is_active: true,
    };
    this.coaches$ = this._userService.all(params);
  }

  setFormFields(client: Client) {
    const { username, first_name, last_name, is_active } = client.user;
    const form = {
      username: username,
      password: '',
      first_name: first_name,
      last_name: last_name,
      is_active: is_active,
      phone: client.phone,
      coach: client.coach.id,
      age: client.age,
      gender: client.gender,
      weight: client.weight,
      height: client.height,
      experience_level: client.experience_level,
      // is_superuser: user.is_superuser,
    };

    this.clientForm.patchValue(form);
  }

  generatePin() {
    const min = 0,
      max = 99999;
    return ('0' + (Math.floor(Math.random() * (max - min + 1)) + min)).substr(
      -6
    );
  }

  handleSubmit(): void {
    if (this.clientForm.invalid) {
      this.clientForm.markAllAsTouched();
      return;
    }

    const form = this.clientForm.value;

    const formData = new FormData();
    formData.append('username', form.username);
    formData.append('first_name', form.first_name);
    formData.append('last_name', form.last_name);
    formData.append('is_active', form.is_active.toString());

    formData.append('age', form.age);
    formData.append('phone', form.phone);
    formData.append('gender', form.gender);
    formData.append('coach', form.coach);
    formData.append('weight', form.weight);
    formData.append('height', form.height);
    formData.append('experience_level', form.experience_level);

    if (form.password) {
      formData.append('password', form.password);
    }

    if (this.photoField) {
      formData.append('avatar', this.photoField);
    }

    if (this.client) {
      this.updateCatalog(this.client.id, formData);
      return;
    }

    this.createCatalog(formData);
  }

  createCatalog(form: FormData) {
    this._clientService
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
    this._clientService
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
      if (this.clientForm.controls[field]) {
        const control = this.clientForm.get(field);
        control?.setErrors({ server: errors[field].join(' ') });
      }
    }

    this.clientForm.markAllAsTouched();
  }

  handleFile(file: File): void {
    this.photoField = file;
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
