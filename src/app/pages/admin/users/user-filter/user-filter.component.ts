import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';

import { TranslocoDirective } from '@jsverse/transloco';
import { PrimeInputComponent, PrimeSelectComponent } from 'app/components';

import { ROLES } from 'app/interfaces';

@Component({
  selector: 'app-user-filter',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    PrimeSelectComponent,
    PrimeInputComponent,
  ],
  templateUrl: './user-filter.component.html',
  styleUrl: './user-filter.component.scss',
})
export class UserFilterComponent {
  private readonly _formBuilder = inject(FormBuilder);

  searchControl = new FormControl();

  filterForm: FormGroup;

  roles = ROLES;

  @Output() filterChange: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
    this.filterForm = this._formBuilder.group({
      search: ['', []],
      role: ['', []],
    });
  }

  handleFilter() {
    const params = this.filterForm.value;
    this.filterChange.emit(params);
  }
}
