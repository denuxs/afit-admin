import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-prime-table',
  standalone: true,
  imports: [TableModule],
  templateUrl: './prime-table.component.html',
  styleUrl: './prime-table.component.scss',
})
export class PrimeTableComponent {
  data = [];
}
