import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss',
})
export class FileUploadComponent {
  @Input() image: string = '';
  @Output() uploadImageChange: EventEmitter<File> = new EventEmitter<File>();

  photoPreview: string | null = null;

  ngOnInit(): void {
    this.photoPreview = this.image;
  }

  handleUploadImage(event: any): void {
    const file: File = event.target.files[0];
    if (!file) {
      return;
    }

    this._readAsDataURL(file).then((data) => {
      this.photoPreview = data;
    });

    this.uploadImageChange.emit(file);
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
