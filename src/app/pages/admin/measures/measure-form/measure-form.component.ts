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
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { AsyncPipe } from '@angular/common';

import { Measure, MeasureDto, User } from 'app/domain';
import { MeasuresService, UserService } from 'app/services';

import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-measure-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    SelectModule,
    CheckboxModule,
    InputTextModule,
    TextareaModule,
  ],
  templateUrl: './measure-form.component.html',
  styleUrl: './measure-form.component.scss',
})
export class MeasureFormComponent implements OnInit {
  private readonly _formBuilder = inject(FormBuilder);

  private readonly _measureService = inject(MeasuresService);
  private readonly _userService = inject(UserService);
  private readonly _unsubscribeAll: Subject<any> = new Subject<any>();

  measureForm: FormGroup;
  users$!: Observable<User[]>;

  measureId: number = 0;

  @Input() measure: Measure | null = null;
  @Output() formChange: EventEmitter<MeasureDto> =
    new EventEmitter<MeasureDto>();

  constructor() {
    this.measureForm = this._formBuilder.group({
      user: ['', [Validators.required]],
      comment: ['', []],
      abdomen: [0, []],
      arm_left: [0, []],
      arm_right: [0, []],
      back: [0, []],
      chest: [0, []],
      forearm: [0, []],
      glutes: [0, []],
      hips: [0, []],
      leg_left: [0, []],
      leg_right: [0, []],
      waist: [0, []],
      weight: [0, []],
      is_active: [true, []],
    });
  }

  ngOnInit(): void {
    this.getUsers();

    if (this.measure) {
      this.measureForm.patchValue(this.measure);
    }
  }

  getUsers() {
    this.users$ = this._userService.getUsers({ search: '' });
  }

  handleSubmit(): void {
    if (this.measureForm.invalid) {
      this.measureForm.markAllAsTouched();
      return;
    }

    const form = this.measureForm.value;

    const body: MeasureDto = {
      comment: form.comment,
      user: form.user,
      is_active: form.is_active,
      measures: {
        abdomen: form.abdomen,
        arm_left: form.arm_left,
        arm_right: form.arm_right,
        back: form.back,
        chest: form.chest,
        forearm: form.forearm,
        glutes: form.glutes,
        hips: form.hips,
        leg_left: form.leg_left,
        leg_right: form.leg_right,
        waist: form.waist,
        weight: form.weight,
      },
    };

    this.formChange.emit(body);
  }

  checkErrors(field: string): string {
    const form: any = this.measureForm.get(field);

    if (form.invalid && (form.dirty || form.touched)) {
      if (form?.hasError('required')) {
        return 'Campo es requerido';
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
