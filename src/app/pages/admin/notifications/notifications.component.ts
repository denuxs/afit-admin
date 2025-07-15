import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Notification as Notif, NotificationList } from 'app/interfaces';
import { NotificationService } from 'app/services';

import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TimeAgoPipe } from 'app/pipes/time-ago.pipe';

import { initializeApp } from 'firebase/app';
import { getMessaging, onMessage } from 'firebase/messaging';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [ProgressSpinnerModule, RouterLink, TimeAgoPipe],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss',
})
export class NotificationsComponent implements OnInit {
  private readonly _notificationService = inject(NotificationService);

  private readonly messaging;

  notifications: Notif[] = [];
  loading = false;

  constructor() {
    const app = initializeApp(environment.firebaseConfig);
    this.messaging = getMessaging(app);
  }

  ngOnInit(): void {
    console.log(Notification.permission);
    if (Notification.permission === 'granted') {
      this.receiveMessage();
    }

    this.fetchNotifications();
  }

  fetchNotifications() {
    this.loading = true;
    this._notificationService.search({ ordering: '-id' }).subscribe({
      next: (data: NotificationList) => {
        this.notifications = data.results;
        this.loading = false;
      },
    });
  }

  receiveMessage() {
    onMessage(this.messaging, (payload: any) => {
      // const { title, body } = payload.notification;
      console.log(payload);
    });
  }

  handleDelete(id: number, index: number) {
    this._notificationService.delete(id).subscribe(() => {
      this.notifications.splice(index, 1);
    });
  }
}
