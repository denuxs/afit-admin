import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';

import { RouterLink } from '@angular/router';

import { TranslocoDirective } from '@jsverse/transloco';
import { PrimeInputComponent } from 'app/components/prime-input/prime-input.component';
import { PrimeSelectComponent } from 'app/components/prime-select/prime-select.component';

@Component({
  selector: 'app-catalog-filter',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    PrimeInputComponent,
    PrimeSelectComponent,
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
