import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe } from '@angular/common';

import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { PaginatorModule } from 'primeng/paginator';

import { PrimeAvatarComponent } from '../prime-avatar/prime-avatar.component';

@Component({
  selector: 'app-prime-table',
  standalone: true,
  imports: [
    TableModule,
    TooltipModule,
    DatePipe,
    PaginatorModule,
    PrimeAvatarComponent,
  ],
  templateUrl: './prime-table.component.html',
  styleUrl: './prime-table.component.scss',
})
export class PrimeTableComponent {
  @Input() columns: any[] = [];
  @Input() data: any[] = [];

  @Input() total = 0;
  @Output() itemDeleted = new EventEmitter<number>();
  @Output() dialogOpened = new EventEmitter<number>();
  @Output() pageChanged = new EventEmitter<any>();

  @Input() first = 0;
  rows = 10;

  openEditDialog(item: number) {
    this.dialogOpened.emit(item);
  }

  handleDelete(item: number) {
    this.itemDeleted.emit(item);
  }

  handlePagination(event: any) {
    this.pageChanged.emit(event);
  }
}
