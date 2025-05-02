import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';

import { RouterLink } from '@angular/router';

import { TranslocoDirective } from '@jsverse/transloco';

import { FormFieldComponent } from 'app/components/form-field/form-field.component';
import { SelectInputComponent } from 'app/components/select-input/select-input.component';

@Component({
  selector: 'app-user-filter',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormFieldComponent,
    SelectInputComponent,
    RouterLink,
    TranslocoDirective,
  ],
  templateUrl: './user-filter.component.html',
  styleUrl: './user-filter.component.scss',
})
export class UserFilterComponent {
  private readonly _formBuilder = inject(FormBuilder);

  searchControl = new FormControl();

  filterForm: FormGroup;

  @Output() filterChange: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
    this.filterForm = this._formBuilder.group({
      search: ['', []],
    });
  }

  handleFilter() {
    const params = this.filterForm.value;
    this.filterChange.emit(params);
  }
}
