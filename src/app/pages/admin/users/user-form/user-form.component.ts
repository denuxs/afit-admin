import {
  Component,
  inject,
  DestroyRef,
  OnInit,
  OnDestroy,
  EventEmitter,
  Output,
  Input,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject } from 'rxjs';

import { Company, GENDERS, ROLES, User } from 'app/interfaces';

import { InputTextModule } from 'primeng/inputtext';

import {
  PrimeCheckboxComponent,
  PrimeFileComponent,
  PrimeInputComponent,
  PrimePasswordComponent,
  PrimeSelectComponent,
} from 'app/components';

import { UserRoutineFormComponent } from '../user-routine-form/user-routine-form.component';
import { UserService } from 'app/core';

import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    PrimeFileComponent,
    PrimeInputComponent,
    PrimeSelectComponent,
    PrimePasswordComponent,
    PrimeCheckboxComponent,
    ProgressSpinner,
    UserRoutineFormComponent,
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
})
export class UserFormComponent implements OnInit, OnDestroy {
  private readonly _formBuilder = inject(FormBuilder);

  private readonly _userService = inject(UserService);

  private readonly _unsubscribeAll: Subject<any> = new Subject<any>();

  @Input() user!: User;
  @Input() companies!: Company[];
  @Input() coaches!: User[];

  @Input()
  set errors(value: any) {
    if (value && Object.keys(value).length > 0) {
      this.setFormErrors(value);
    }
  }

  @Output() formChanged: EventEmitter<any> = new EventEmitter<any>();

  destroyRef = inject(DestroyRef);

  genders = GENDERS;
  roles = ROLES;

  photoField!: File;
  avatar = '';
  routines = [];
  loading = false;

  userForm: FormGroup = this._formBuilder.group({
    username: ['', [Validators.required]],
    first_name: ['', [Validators.required]],
    last_name: ['', [Validators.required]],
    company: ['', [Validators.required]],
    password: ['', [Validators.required]],
    role: ['', [Validators.required]],
    coach: ['', []],
    is_active: [true, []],
    routines: this._formBuilder.array([]),
  });

  constructor() {
    // this.userForm.patchValue({
    //   password: this.generatePin(),
    // });
  }

  ngOnInit(): void {
    if (this.user) {
      this.setFormFields(this.user);
    }
  }

  setFormFields(user: User) {
    const form = {
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      company: user.company,
      is_active: user.is_active,
      role: user.role,
      coach: user.coach,
    };

    this.userForm.patchValue(form);
    this.userForm.get('username')?.disable();
    this.userForm.get('password')?.clearValidators();
    this.userForm.controls['password'].updateValueAndValidity();

    if (user.avatar) {
      this.avatar = user.avatar;
    }

    const userId = this.user.id;

    this.getUserRoutines(userId);
  }

  getUserRoutines(userId: number): void {
    this.loading = true;
    this._userService.routines(userId).subscribe({
      next: (routines: any) => {
        this.routines = routines;

        this.loading = false;
      },
      // error: errors => this.setFormErrors(errors),
    });
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
    const formData = this.buildFormData(form);
    this.formChanged.emit(formData);
  }

  buildFormData(form: any) {
    const formData = new FormData();

    formData.append('first_name', form.first_name);
    formData.append('last_name', form.last_name);
    formData.append('role', form.role);
    formData.append('is_active', Number(form.is_active).toString());
    formData.append('company', Number(form.company).toString());

    formData.append('coach', form.coach ?? '');

    if (form.username) {
      formData.append('username', form.username);
    }

    if (form.password) {
      formData.append('password', form.password);
    }

    if (this.photoField) {
      formData.append('avatar', this.photoField);
    }

    const routines = form.routines;
    formData.append('routines', JSON.stringify(routines));

    return formData;
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
