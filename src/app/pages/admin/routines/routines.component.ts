import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

import { Workout } from 'app/domain';
import { WorkoutService } from 'app/services';
import { YesNoPipe } from 'app/pipes/yes-no.pipe';

import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { faSolidCircleCheck } from '@ng-icons/font-awesome/solid';
@Component({
  selector: 'app-routines',
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe,
    ReactiveFormsModule,
    RouterLink,
    TableModule,
    TooltipModule,
    YesNoPipe,
    TagModule,
    NgIcon,
  ],
  providers: [provideIcons({ faSolidCircleCheck })],
  templateUrl: './routines.component.html',
  styleUrl: './routines.component.scss',
})
export class RoutinesComponent implements OnInit {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _workoutService = inject(WorkoutService);

  workoust$!: Observable<Workout[]>;

  filterForm: FormGroup;

  days = [
    'Lunes',
    'Martes',
    'Miercoles',
    'Jueves',
    'Viernes',
    'Sabado',
    'Domingo',
  ];

  constructor() {
    this.filterForm = this._formBuilder.group({
      search: ['', []],
    });
  }

  ngOnInit(): void {
    this.getWorkouts();
  }

  getWorkouts(params?: { search?: string; key?: string }): void {
    this.workoust$ = this._workoutService.fetchWorkouts({
      ...params,
    });
  }

  handleFilter() {
    const params = this.filterForm.value;
    this.getWorkouts(params);
  }

  getDay(day: number): string {
    return this.days[day - 1];
  }
}
