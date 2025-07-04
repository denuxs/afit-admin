import { Component, inject, OnDestroy, OnInit } from '@angular/core';

import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Routine } from 'app/domain';
import { RoutineService } from 'app/services';
import { Subject, takeUntil } from 'rxjs';

import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-routine-list',
  standalone: true,
  imports: [TableModule, IconFieldModule, InputIconModule, InputTextModule],
  templateUrl: './routine-list.component.html',
  styleUrl: './routine-list.component.scss',
})
export class RoutineListComponent implements OnInit, OnDestroy {
  private readonly _routineService = inject(RoutineService);
  private readonly _ref = inject(DynamicDialogRef);

  private readonly _unsubscribeAll: Subject<any> = new Subject<any>();

  data: Routine[] = [];
  selectedItems!: any;

  ngOnInit(): void {
    this.getRoutines();
  }

  getRoutines() {
    const params = {
      ordering: '-id',
      paginator: null,
    };

    this._routineService
      .all(params)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (routine: Routine[]) => {
          this.data = routine;
        },
      });
  }

  handleRowSelect(event: any) {
    const selected = event.data;
    const { id, title } = selected;

    this._ref.close({ id, title });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();

    if (this._ref) {
      this._ref.close();
    }
  }
}
