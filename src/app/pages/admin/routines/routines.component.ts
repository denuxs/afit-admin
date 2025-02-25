import { Component, inject, OnInit } from '@angular/core';
import { Routine } from 'app/domain';
import { RoutineService } from 'app/services';
import { Observable } from 'rxjs';
import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-routines',
  standalone: true,
  imports: [AsyncPipe, DatePipe, NgIf, RouterLink],
  templateUrl: './routines.component.html',
  styleUrl: './routines.component.scss',
})
export class RoutinesComponent implements OnInit {
  private readonly _routineService = inject(RoutineService);

  routines$!: Observable<Routine[]>;

  ngOnInit(): void {
    this.routines$ = this._routineService.fetchRoutines();
  }
}
