import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';

import { Muscle } from 'app/domain';
import { MuscleService } from 'app/services';

@Component({
  selector: 'app-muscles',
  standalone: true,
  imports: [NgIf, AsyncPipe, DatePipe, RouterLink],
  templateUrl: './muscles.component.html',
  styleUrl: './muscles.component.scss',
})
export class MusclesComponent implements OnInit {
  private readonly _muscleService = inject(MuscleService);

  muscles$!: Observable<Muscle[]>;

  ngOnInit(): void {
    this.muscles$ = this._muscleService.fetchMuscles();
  }
}
