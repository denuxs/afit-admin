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
  selector: 'app-catalog-filter',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormFieldComponent,
    SelectInputComponent,
    RouterLink,
    TranslocoDirective,
  ],
  templateUrl: './catalog-filter.component.html',
  styleUrl: './catalog-filter.component.scss',
})
export class CatalogFilterComponent {
  private readonly _formBuilder = inject(FormBuilder);

  searchControl = new FormControl();

  filterForm: FormGroup;

  @Input() catalogTypes: any[] = [];
  @Output() filterChange: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
    this.filterForm = this._formBuilder.group({
      search: ['', []],
      key: ['', []],
    });
  }

  handleFilter() {
    const params = this.filterForm.value;
    this.filterChange.emit(params);
  }
}
