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
import { Catalog } from 'app/domain';

@Component({
  selector: 'app-exercise-filter',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormFieldComponent,
    SelectInputComponent,
    RouterLink,
    TranslocoDirective,
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
