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

import { Catalog } from 'app/domain';

@Component({
  selector: 'app-exercise-filter',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    TranslocoDirective,
    PrimeInputComponent,
    PrimeSelectComponent,
  ],
  templateUrl: './exercise-filter.component.html',
  styleUrl: './exercise-filter.component.scss',
})
export class ExerciseFilterComponent {
  private readonly _formBuilder = inject(FormBuilder);

  searchControl = new FormControl();

  filterForm: FormGroup;

  @Input() muscles!: Catalog[];
  @Input() equipments!: Catalog[];

  @Output() filterChange: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
    this.filterForm = this._formBuilder.group({
      search: ['', []],
      muscle: ['', []],
      equipment: ['', []],
    });
  }

  handleFilter() {
    const params = this.filterForm.value;
    this.filterChange.emit(params);
  }
}
