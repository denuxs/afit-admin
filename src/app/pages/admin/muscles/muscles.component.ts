import { Component, inject, OnInit } from '@angular/core';
import { Muscle } from 'app/domain';
import { MuscleService } from 'app/services';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-muscles',
  standalone: true,
  imports: [],
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
