import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';

import { Measure } from 'app/domain';
import { MeasuresService } from 'app/services';

@Component({
  selector: 'app-measures',
  standalone: true,
  imports: [NgIf, AsyncPipe, DatePipe, RouterLink],
  templateUrl: './measures.component.html',
  styleUrl: './measures.component.scss',
})
export class MeasuresComponent implements OnInit {
  private readonly _measureService = inject(MeasuresService);

  measures$!: Observable<Measure[]>;

  ngOnInit(): void {
    this.measures$ = this._measureService.fetchMeasures();
  }
}
