import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import { Observable, Subject, takeUntil } from 'rxjs';

import { ImageService } from 'app/services';
import { Image } from 'app/interfaces';

import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ImageModule } from 'primeng/image';

@Component({
  selector: 'app-upload-image',
  standalone: true,
  imports: [NgOptimizedImage, ImageModule, ConfirmDialogModule, AsyncPipe],
  providers: [ConfirmationService],
  templateUrl: './upload-image.component.html',
  styleUrl: './upload-image.component.scss',
})
export class UploadImageComponent implements OnInit {
  private readonly _imageService = inject(ImageService);
  private readonly _confirmationService = inject(ConfirmationService);

  private readonly _unsubscribeAll: Subject<any> = new Subject<any>();

  @Input() contentType = 0;
  @Input() objectId = 0;

  images$!: Observable<Image[]>;

  ngOnInit(): void {
    if (this.objectId && this.contentType) {
      this.getImages(this.objectId, this.contentType);
    }
  }

  getImages(object_id: number, contentType: number) {
    this.images$ = this._imageService.fetchImages({
      object_id: object_id,
      content_type: contentType,
    });
  }

  handleUploadImage(event: any): void {
    const file: File = event.target.files[0];
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append('photo', file);
    formData.append('object_id', this.objectId.toString());
    formData.append('content_type', this.contentType.toString());

    this.saveImage(formData);
  }

  saveImage(form: FormData): void {
    this._imageService
      .saveImage(form)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (image: Image) => {
          this.getImages(this.objectId, this.contentType);
        },
      });
  }

  handleDelete(imageId: number): void {
    this._confirmationService.confirm({
      message: 'Se eliminará este imagen. ¿Está seguro?',
      header: 'Confirmar',
      // icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-info',
      rejectButtonStyleClass: 'p-button-outlined p-button-secondary',
      accept: () => {
        this._imageService
          .deleteImage(imageId)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe({
            next: () => {
              this.getImages(this.objectId, this.contentType);
            },
          });
      },
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
