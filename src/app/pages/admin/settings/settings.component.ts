import { Component } from '@angular/core';
import { SettingNotificationsComponent } from './setting-notifications/setting-notifications.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [SettingNotificationsComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {}
