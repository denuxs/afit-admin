import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  UntypedFormBuilder,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { Catalog, CatalogDto } from 'app/domain';

import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';

import { UploadImageComponent } from 'app/components/upload-image/upload-image.component';
import { CatalogService } from 'app/services';

import { FormFieldComponent } from 'app/components/form-field/form-field.component';
import { SelectInputComponent } from 'app/components/select-input/select-input.component';

@Component({
  selector: 'app-catalogs-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    SelectModule,
    RouterLink,
    UploadImageComponent,
    FormFieldComponent,
    SelectInputComponent,
  ],
  templateUrl: './catalogs-form.component.html',
  styleUrl: './catalogs-form.component.scss',
})
export class CatalogsFormComponent implements OnInit {
  private readonly _formBuilder = inject(UntypedFormBuilder);
  private readonly _router = inject(Router);

  private readonly _unsubscribeAll: Subject<any> = new Subject<any>();

  private readonly _catalogService = inject(CatalogService);

  @Input() catalog: Catalog | null = null;
  @Output() formChange: EventEmitter<any> = new EventEmitter<any>();

  catalogForm: FormGroup;

  catalogTypes = [
    {
      name: 'Musculo',
      id: 'muscle',
    },
    {
      name: 'Equipo',
      id: 'equipment',
    },
  ];

  contentType = 10;
  objectId = 0;

  constructor() {
    this.catalogForm = this._formBuilder.group({
      name: ['', [Validators.required]],
      key: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    if (this.catalog) {
      this.objectId = this.catalog.id;
      this.setFormValue(this.catalog);
    }
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

    const form: CatalogDto = {
      name,
      key,
    };

    if (this.catalog) {
      this.update(this.catalog.id, form);
      return;
    }

    this.save(form);
  }

  save(form: CatalogDto) {
    this._catalogService
      .saveCatalog(form)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: () => {
          this._router.navigateByUrl('/admin/catalogs');
        },
        error: errors => this.setFormErrors(errors),
      });
  }

  update(id: number, form: CatalogDto) {
    this._catalogService
      .updateCatalog(id, form)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: () => {
          this._router.navigateByUrl('/admin/catalogs');
        },
        error: errors => this.setFormErrors(errors),
      });
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

  showErrors(key: string): string {
    const field: any = this.catalogForm.get(key);

    if (field.invalid && (field.dirty || field.touched)) {
      if (field?.hasError('required')) {
        return 'Campo requerido';
      }

      if (field?.hasError('server')) {
        return field.errors['server'];
      }
    }
    return '';
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
