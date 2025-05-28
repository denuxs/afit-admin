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
  selector: 'app-client-filter',
  standalone: true,
  imports: [ReactiveFormsModule, TranslocoDirective, PrimeInputComponent],
  templateUrl: './client-filter.component.html',
  styleUrl: './client-filter.component.scss',
})
export class ClientFilterComponent {
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
