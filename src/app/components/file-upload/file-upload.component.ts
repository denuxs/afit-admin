import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss',
})
export class FileUploadComponent {
  @Input() image = '';
  @Output() fileChange: EventEmitter<File> = new EventEmitter<File>();

  handleUpload(event: any): void {
    const file: File = event.target.files[0];
    if (!file) {
      return;
    }

    this._readAsDataURL(file).then(response => {
      this.image = response;
    });

    this.fileChange.emit(file);
  }

  private _readAsDataURL(file: File): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (): void => {
        resolve(reader.result);
      };

      reader.onerror = (e): void => {
        reject(e);
      };

      reader.readAsDataURL(file);
    });
  }
}
