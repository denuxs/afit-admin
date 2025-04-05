import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormArray,
  UntypedFormGroup,
  UntypedFormBuilder,
  UntypedFormControl,
  Validators,
  AbstractControl,
  FormControl,
} from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { AsyncPipe } from '@angular/common';

import { UserService } from 'app/services';
import { Exercise, User, Workout, WorkoutDto } from 'app/domain';

import { SelectModule } from 'primeng/select';
import { EditorModule } from 'primeng/editor';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';

import { RoutineDetailComponent } from '../routine-detail/routine-detail.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-routine-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    ButtonModule,
    SelectModule,
    EditorModule,
    RoutineDetailComponent,
    CheckboxModule,
    RadioButtonModule,
    InputTextModule,
  ],
  templateUrl: './routine-form.component.html',
  styleUrl: './routine-form.component.scss',
})
export class RoutineFormComponent implements OnInit {
  private readonly _formBuilder = inject(UntypedFormBuilder);

  private readonly _userService = inject(UserService);
  private readonly _unsubscribeAll: Subject<any> = new Subject<any>();

  routineForm!: UntypedFormGroup;
  exercisesList!: Exercise[];
  users$!: Observable<User[]>;

  routineId: number = 0;
  modules = {
    toolbar: [['bold'], [{ list: 'ordered' }, { list: 'bullet' }]],
  };

  days = [
    { value: 1, label: 'Lunes' },
    { value: 2, label: 'Martes' },
    { value: 3, label: 'Miercoles' },
    { value: 4, label: 'Jueves' },
    { value: 5, label: 'Viernes' },
    { value: 6, label: 'Sabado' },
    { value: 7, label: 'Domingo' },
  ];

  @Input() workout: Workout | null = null;
  @Output() formChange: EventEmitter<WorkoutDto> =
    new EventEmitter<WorkoutDto>();

  constructor() {
    this.routineForm = this._formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', []],
      day: ['', [Validators.required]],
      user: ['', [Validators.required]],
      exercises: this._formBuilder.array([]),
      is_active: [true, []],
    });
  }

  ngOnInit(): void {
    this.getUsers();

    if (this.workout) {
      const { name, description, day, user, is_active } = this.workout;
      const form = {
        name: name,
        description: description,
        day: day,
        user: user.id,
        is_active: is_active,
      };
      this.routineForm.patchValue(form);
    }
  }

  getUsers(): void {
    this.users$ = this._userService.getUsers({ search: '' });
  }

  handleSubmit(): void {
    if (this.routineForm.invalid) {
      this.routineForm.markAllAsTouched();
      return;
    }

    const { name, description, day, user, exercises, is_active } =
      this.routineForm.value;

    const form: WorkoutDto = {
      name,
      description,
      day,
      user,
      exercises,
      is_active,
    };

    this.formChange.emit(form);
  }

  checkErrors(field: string): string {
    const form: any = this.routineForm.get(field);

    if (form.invalid && (form.dirty || form.touched)) {
      if (form?.hasError('required')) {
        return 'Campo requerido';
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
