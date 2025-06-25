import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
// import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-prime-file',
  standalone: true,
  imports: [],
  templateUrl: './prime-file.component.html',
  styleUrl: './prime-file.component.scss',
})
export class PrimeFileComponent implements OnInit {
  @Input() image!: string | undefined;
  @Output() fileChange: EventEmitter<File> = new EventEmitter<File>();

  ngOnInit(): void {
    if (!this.image) {
      this.image = 'default.jpg';
    }
  }

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
