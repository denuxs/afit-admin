import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(private readonly updateService: SwUpdate) {}

  ngOnInit(): void {
    if (this.updateService.isEnabled) {
      this.checkForUpdate();
    }
  }

  async checkForUpdate() {
    try {
      const updateFound = await this.updateService.checkForUpdate();
      console.log(
        updateFound
          ? 'A new version is available.'
          : 'Already on the latest version.',
      );
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
