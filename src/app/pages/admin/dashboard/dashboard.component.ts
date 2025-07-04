import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Dashboard, User } from 'app/domain';
import { DashboardService } from 'app/services/dashboard.service';
import { UserService } from 'app/services';

import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [AsyncPipe, ProgressSpinner],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private readonly _dashboardService = inject(DashboardService);
  private readonly _userService = inject(UserService);

  dashboard$!: Observable<Dashboard>;
  user!: User;

  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    this._userService.user$.subscribe({
      next: (response: User) => {
        this.user = response;
        this.getDashboard();
      },
    });
  }

  getDashboard() {
    this.dashboard$ = this._dashboardService.fetchDashboard();
  }
}
