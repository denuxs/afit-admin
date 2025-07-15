import {
  Component,
  inject,
  DestroyRef,
  OnInit,
  OnDestroy,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { forkJoin, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { Company, GENDERS, ROLES, Routine, User } from 'app/interfaces';
import { CompanyService } from 'app/services';
import { UserService } from 'app/core';

import { InputTextModule } from 'primeng/inputtext';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';

import {
  CdkDragDrop,
  CdkDropList,
  CdkDrag,
  moveItemInArray,
} from '@angular/cdk/drag-drop';

import {
  PrimeCheckboxComponent,
  PrimeFileComponent,
  PrimeInputComponent,
  PrimePasswordComponent,
  PrimeSelectComponent,
} from 'app/components';
import { RoutineListComponent } from '../routine-list/routine-list.component';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    InputTextModule,
    PrimeFileComponent,
    PrimeInputComponent,
    PrimeSelectComponent,
    PrimePasswordComponent,
    PrimeCheckboxComponent,
    CdkDropList,
    CdkDrag,
    RouterLink,
  ],
  providers: [DialogService],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
})
export class UserFormComponent implements OnInit, OnDestroy {
  private readonly _route = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _formBuilder = inject(FormBuilder);

  private readonly _dialogService = inject(DialogService);

  private readonly _userService = inject(UserService);
  private readonly _companyService = inject(CompanyService);
  private readonly _unsubscribeAll: Subject<any> = new Subject<any>();

  userForm: FormGroup;
  user!: User;
  destroyRef = inject(DestroyRef);

  photoField!: File;
  image = 'default.jpg';

  companies!: Company[];
  coaches!: User[];

  genders = GENDERS;
  roles = ROLES;

  title = 'Crear Usuario';

  constructor() {
    this.userForm = this._formBuilder.group({
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

    // this.userForm.patchValue({
    //   password: this.generatePin(),
    // });
  }

  ngOnInit(): void {
    this.getData();

    const userId = this._route.snapshot.paramMap.get('id');

    if (userId) {
      this.title = 'Editar Usuario';
      this.getUser(Number(userId));
    }
  }

  getData(): void {
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
        },
      });
  }

  getUser(userId: number): void {
    this._userService
      .get(userId)
      .pipe(takeUntil(this._unsubscribeAll))
      .pipe(
        switchMap(user => {
          this.user = user;
          this.setFormFields(user);
          return this._userService.routines(user.id);
        })
      )
      .subscribe({
        next: (routines: any) => {
          this.setRoutines(routines);
        },
      });
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
      this.image = user.avatar;
    }
  }

  setRoutines(data: any) {
    for (const item of data) {
      const formGroup = this._formBuilder.group({
        routine: [item.routine.id, [Validators.required]],
        order: [item.order, [Validators.required]],
        title: [item.routine.title, []],
      });

      this.routines.push(formGroup);
    }
  }

  get routines(): FormArray {
    return this.userForm.get('routines') as FormArray;
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
    console.log(form);

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
          const url = `/admin/users`;
          this._router.navigateByUrl(url);
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
          const url = `/admin/users`;
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

  openRoutineModal(): void {
    const ref = this._dialogService.open(RoutineListComponent, {
      header: 'Rutinas',
      modal: true,
      position: 'top',
      appendTo: 'body',
      closable: true,
      // contentStyle: { height: '300px' },
    });

    ref.onClose.subscribe((data: any) => {
      if (data) {
        this.addRoutine(data);
      }
    });
  }

  addRoutine(item: Routine): void {
    const nextOrder =
      this.routines.length > 0
        ? Math.max(...this.routines.controls.map(c => c.get('order')?.value)) +
          1
        : 1;

    const formGroup: FormGroup = this._formBuilder.group({
      routine: [item.id, [Validators.required]],
      order: [nextOrder, [Validators.required]],
      title: [item.title, []],
    });

    this.routines.push(formGroup);
  }

  handleDragDrop(event: CdkDragDrop<any>) {
    const previousIndex = event.previousIndex;
    const currentIndex = event.currentIndex;

    moveItemInArray(this.routines.controls, previousIndex, currentIndex);

    this.handleOrder();
  }

  handleOrder(): void {
    this.routines.controls.forEach((control, index) => {
      control.get('order')?.setValue(index + 1);
    });
  }

  handleFile(file: File): void {
    this.photoField = file;
  }

  removeRoutine(index: number): void {
    this.routines.removeAt(index);
    this.handleOrder();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
