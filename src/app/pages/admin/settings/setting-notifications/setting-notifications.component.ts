import { Component, inject, OnInit } from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  UntypedFormBuilder,
  Validators,
} from '@angular/forms';

import { ToggleSwitch, ToggleSwitchChangeEvent } from 'primeng/toggleswitch';

import { DeviceDetectorService } from 'ngx-device-detector';

import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';
import { environment } from '../../../../../environments/environment';

import { UserService } from 'app/core';
import { User } from 'app/interfaces';

@Component({
  selector: 'app-setting-notifications',
  standalone: true,
  imports: [ReactiveFormsModule, ToggleSwitch],
  templateUrl: './setting-notifications.component.html',
  styleUrl: './setting-notifications.component.scss',
})
export class SettingNotificationsComponent implements OnInit {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _deviceService = inject(DeviceDetectorService);

  private readonly _userService = inject(UserService);
  private readonly messaging;

  profileForm: FormGroup = this._formBuilder.group({
    notification: [false, [Validators.required]],
  });

  user!: User;

  constructor() {
    const app = initializeApp(environment.firebaseConfig);
    this.messaging = getMessaging(app);
  }

  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    this._userService.user$.subscribe({
      next: (user: User) => {
        this.user = user;
      },
    });
  }

  notificationToggle(event: ToggleSwitchChangeEvent): void {
    const { checked } = event;

    if (checked) {
      this.requestPermission();
      // if (Notification.permission === 'granted') {
      //   this.getFcmToken(this.user);
      //   return;
      // }

      // if (Notification.permission === 'denied') {
      //   this.requestPermission();
      // }
    }
  }

  requestPermission() {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        this.getFcmToken(this.user);
      }
    });
  }

  getFcmToken(user: User) {
    return getToken(this.messaging, {
      vapidKey: environment.vapidKey,
    })
      .then(currentToken => {
        if (!currentToken) {
          console.log('No registration token available.');
          return;
        }

        if (currentToken) {
          this.saveToken(user.id, currentToken);
        }
      })
      .catch(err => {
        console.log('Error getting token', err);
      });
  }

  saveToken(userId: number, token: string) {
    const info = this._deviceService.getDeviceInfo();

    const form = {
      token: token,
      user: userId,
      device: info.browser,
    };
    this._userService.saveFirebaseToken(form).subscribe();
  }
}
