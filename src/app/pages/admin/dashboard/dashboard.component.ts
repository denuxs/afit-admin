import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Dashboard } from 'app/domain';
import { DashboardService } from 'app/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgIf, AsyncPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private readonly _dashboardService = inject(DashboardService);

  dashboard$!: Observable<Dashboard>;

  ngOnInit(): void {
    this.dashboard$ = this._dashboardService.fetchDashboard();
  }
}
