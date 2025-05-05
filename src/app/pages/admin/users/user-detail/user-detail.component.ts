import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';

import { TabsModule } from 'primeng/tabs';

import { UserService } from 'app/services';
import { User } from 'app/domain';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [TabsModule, RouterOutlet, RouterLink],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss',
})
export class UserDetailComponent implements OnInit, OnDestroy {
  private readonly _route = inject(ActivatedRoute);
  private readonly _userService = inject(UserService);

  private readonly _unsubscribeAll: Subject<any> = new Subject<any>();

  tabs = [{ route: 'workouts', label: 'Rutinas', icon: 'pi pi-home' }];

  user!: User;

  ngOnInit(): void {
    const userId = this._route.snapshot.paramMap.get('userid');
    if (userId) {
      this.getUser(Number(userId));
    }
  }

  getUser(userId: number) {
    this._userService
      .get(userId)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (user: User) => {
          this.user = user;
        },
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
