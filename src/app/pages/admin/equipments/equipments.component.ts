import { Component, inject, OnInit } from '@angular/core';
import { Equipment } from 'app/domain';
import { EquipmentService } from 'app/services';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-equipments',
  standalone: true,
  imports: [],
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
