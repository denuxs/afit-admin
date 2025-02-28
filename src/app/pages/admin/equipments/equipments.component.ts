import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';

import { Equipment } from 'app/domain';
import { EquipmentService } from 'app/services';

@Component({
  selector: 'app-equipments',
  standalone: true,
  imports: [NgIf, AsyncPipe, DatePipe, RouterLink],
  templateUrl: './equipments.component.html',
  styleUrl: './equipments.component.scss',
})
export class EquipmentsComponent implements OnInit {
  private readonly _equipmentService = inject(EquipmentService);

  equipments$!: Observable<Equipment[]>;

  ngOnInit(): void {
    this.equipments$ = this._equipmentService.fetchEquipments();
  }
}
