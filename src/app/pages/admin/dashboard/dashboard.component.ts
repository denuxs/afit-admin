import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Dashboard } from 'app/interfaces';
import { DashboardService } from 'app/services/dashboard.service';
import { UserService } from 'app/core';

import { ProgressSpinner } from 'primeng/progressspinner';

import { User } from '@angular/fire/auth';

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
  user!: User | null;

  ngOnInit(): void {
    this.getUser();
    this.getDashboard();
  }

  getUser() {
    this.user = this._userService.currentUser();

    // this._userService.user$.subscribe({
    //   next: (response: User) => {
    //     this.user = response;
    //     this.getDashboard();
    //   },
    // });
  }

  getDashboard() {
    this.dashboard$ = this._dashboardService.fetchDashboard();
  }
}
