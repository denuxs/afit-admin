import { Component, inject, Input } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable, Subject, takeUntil } from 'rxjs';

import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ImageModule } from 'primeng/image';

import { Image } from 'app/interfaces';
import { ImageService } from 'app/services/image.service';

@Component({
  selector: 'measure-images',
  standalone: true,
  imports: [AsyncPipe, ImageModule, ConfirmDialogModule],
  providers: [ConfirmationService],
  templateUrl: './measure-images.component.html',
  styleUrl: './measure-images.component.scss',
})
export class MeasureImagesComponent {
  private readonly _imageService = inject(ImageService);
  private readonly _confirmationService = inject(ConfirmationService);

  private readonly _unsubscribeAll: Subject<any> = new Subject<any>();

  @Input() measureId!: number;

  images$!: Observable<Image[]>;
  contentType: number = 15;

  ngOnInit(): void {
    this.getImages(+this.measureId, this.contentType);
  }

  getImages(measureId: number, contentType: number) {
    this.images$ = this._imageService
      .fetchImages({
        object_id: measureId,
        content_type: contentType,
      })
      .pipe(takeUntil(this._unsubscribeAll));
  }

  uploadImage(event: any, measureId: number, contentType: number): void {
    const file: File = event.target.files[0];
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append('photo', file);
    formData.append('object_id', measureId.toString());
    formData.append('content_type', contentType.toString());

    this.saveImage(formData);
  }

  saveImage(form: FormData): void {
    this._imageService
      .saveImage(form)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (image: Image) => {
          this.getImages(image.object_id, this.contentType);
        },
      });
  }

  deleteImage(imageId: number, measureId: number): void {
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
              this.getImages(measureId, this.contentType);
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
