import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

import { Exercise } from 'app/domain';
import { ExerciseService } from 'app/services';

import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-exercises',
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe,
    ReactiveFormsModule,
    RouterLink,
    TableModule,
    TooltipModule,
  ],
  templateUrl: './exercises.component.html',
  styleUrl: './exercises.component.scss',
})
export class ExercisesComponent implements OnInit {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _exerciseService = inject(ExerciseService);

  exercises$!: Observable<Exercise[]>;

  filterForm: FormGroup;

  constructor() {
    this.filterForm = this._formBuilder.group({
      search: ['', []],
    });
  }

  ngOnInit(): void {
    this.getExercises();
  }

  getExercises(params?: { search?: string; key?: string }): void {
    this.exercises$ = this._exerciseService.fetchExercises({
      ...params,
    });
  }

  handleFilter() {
    const params = this.filterForm.value;
    this.getExercises(params);
  }
}
