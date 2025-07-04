import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  UntypedFormBuilder,
  Validators,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { Catalog } from 'app/domain';

import {
  DialogService,
  DynamicDialogComponent,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';

import { CatalogService } from 'app/services';

import {
  PrimeFileComponent,
  PrimeInputComponent,
  PrimeSelectComponent,
} from 'app/components';

@Component({
  selector: 'app-catalogs-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    PrimeInputComponent,
    PrimeSelectComponent,
    PrimeFileComponent,
  ],
  providers: [DialogService, MessageService],
  templateUrl: './catalogs-form.component.html',
  styleUrl: './catalogs-form.component.scss',
})
export class CatalogsFormComponent implements OnInit, OnDestroy {
  private readonly _formBuilder = inject(UntypedFormBuilder);
  private readonly _config = inject(DynamicDialogConfig);
  private readonly _ref = inject(DynamicDialogRef);

  private readonly _unsubscribeAll: Subject<any> = new Subject<any>();

  private readonly _catalogService = inject(CatalogService);

  catalogForm: FormGroup;
  catalog!: Catalog;
  photoField!: File;
  image = 'default.jpg';

  categories = [];

  constructor() {
    this.catalogForm = this._formBuilder.group({
      name: ['', [Validators.required]],
      key: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    const config = this._config.data;
    const { categories } = config;
    this.categories = categories;

    if (config && 'catalog' in config) {
      this.getCatalog(config.catalog);
    }
  }

  getCatalog(catalog: number) {
    this._catalogService
      .get(catalog)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (catalog: Catalog) => {
          this.catalog = catalog;

          if (catalog.image) {
            this.image = catalog.image;
          }

          this.setFormValue(catalog);
        },
      });
  }

  setFormValue(catalog: Catalog) {
    const form = {
      name: catalog.name,
      key: catalog.key,
    };
    this.catalogForm.patchValue(form);
  }

  handleSubmit(): void {
    if (this.catalogForm.invalid) {
      this.catalogForm.markAllAsTouched();
      return;
    }

    const { name, key } = this.catalogForm.value;

    const formData = new FormData();
    formData.append('name', name);
    formData.append('key', key);

    if (this.photoField) {
      formData.append('image', this.photoField);
    }

    if (this.catalog) {
      this.updateCatalog(this.catalog.id, formData);
      return;
    }

    this.createCatalog(formData);
  }

  createCatalog(form: FormData) {
    this._catalogService
      .create(form)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: () => {
          this.closeDialog();
        },
        error: errors => this.setFormErrors(errors),
      });
  }

  updateCatalog(id: number, form: FormData) {
    this._catalogService
      .update(id, form)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: () => {
          this.closeDialog();
        },
        error: errors => this.setFormErrors(errors),
      });
  }

  closeDialog() {
    this._ref.close(true);
  }

  setFormErrors(errors: any) {
    for (const field in errors) {
      if (this.catalogForm.controls[field]) {
        const control = this.catalogForm.get(field);
        control?.setErrors({ server: errors[field].join(' ') });
      }
    }

    this.catalogForm.markAllAsTouched();
  }

  handleFile(file: File): void {
    this.photoField = file;
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();

    if (this._ref) {
      this._ref.close();
    }
  }
}
