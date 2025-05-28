import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';

import { TranslocoDirective } from '@jsverse/transloco';

import { PrimeInputComponent } from 'app/components/prime-input/prime-input.component';

@Component({
  selector: 'app-routine-filter',
  standalone: true,
  imports: [ReactiveFormsModule, TranslocoDirective, PrimeInputComponent],
  templateUrl: './routine-filter.component.html',
  styleUrl: './routine-filter.component.scss',
})
export class RoutineFilterComponent {
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
