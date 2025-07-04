import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';

import { ToastModule } from 'primeng/toast';
import { ToastMessageService } from './core/services/toast-message.service';

import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastModule],
  providers: [MessageService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private readonly _updateService = inject(SwUpdate);
  private readonly _messageService = inject(MessageService);
  private readonly _toastMessageService = inject(ToastMessageService);

  ngOnInit(): void {
    if (this._updateService.isEnabled) {
      this.checkForUpdate();
    }

    this._toastMessageService.message$.subscribe(message => {
      this._messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: message,
      });
    });
  }

  async checkForUpdate() {
    try {
      const updateFound = await this._updateService.checkForUpdate();

      if (updateFound) {
        if (confirm('New version available. Load new version?')) {
          // Reload the page to update to the latest version.
          document.location.reload();
        }
      }
    } catch (err) {
      console.error('Failed to check for updates:', err);
    }
  }
}
