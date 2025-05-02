import {
  Component,
  inject,
  DestroyRef,
  OnInit,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject } from 'rxjs';

import { User } from 'app/domain';
import { FileUploadComponent } from 'app/components/file-upload/file-upload.component';

import { Password } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';

import { UploadImageComponent } from 'app/components/upload-image/upload-image.component';
@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SelectModule,
    CheckboxModule,
    FileUploadComponent,
    InputTextModule,
    UploadImageComponent,
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
})
export class UserFormComponent implements OnInit {
  private readonly _formBuilder = inject(FormBuilder);

  private readonly _unsubscribeAll: Subject<any> = new Subject<any>();

  @Input() user: User | null = null;
  @Output() formChange: EventEmitter<any> = new EventEmitter<any>();

  userForm: FormGroup;
  destroyRef = inject(DestroyRef);

  photoField!: File;

  genders: any[] = [
    {
      name: 'Masculino',
      id: 'male',
    },
    {
      name: 'Femenino',
      id: 'female',
    },
  ];

  contentType = 8;
  objectId = 0;

  constructor() {
    this.userForm = this._formBuilder.group({
      username: ['', [Validators.required]],
      // email: ['', [Validators.required]],
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      password: ['', []],
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
    if (this.user) {
      this.objectId = this.user.id;
      this.setFormFields(this.user);
    }
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
    formData.append('is_active', Number(form.is_active).toString());

    if (form.password) {
      formData.append('password', form.password);
    }

    if (this.photoField) {
      formData.append('photo', this.photoField);
    }

    this.formChange.emit(formData);
  }

  checkErrors(field: string): string {
    const form: any = this.userForm.get(field);

    if (form.invalid && (form.dirty || form.touched)) {
      if (form?.hasError('required')) {
        return 'Campo requerido';
      }

      if (form?.hasError('max')) {
        return 'Value is invalid';
      }
    }
    return '';
  }

  onUploadImage(file: File): void {
    this.photoField = file;
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
