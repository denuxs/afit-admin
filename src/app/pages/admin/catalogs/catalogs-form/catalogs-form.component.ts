import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  UntypedFormBuilder,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { Catalog, CatalogDto } from 'app/domain';
import { CatalogService } from 'app/services';

import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';

@Component({
  selector: 'app-catalogs-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    Toast,
    InputTextModule,
    SelectModule,
    RouterLink,
  ],
  providers: [MessageService],
  templateUrl: './catalogs-form.component.html',
  styleUrl: './catalogs-form.component.scss',
})
export class CatalogsFormComponent implements OnInit {
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  private readonly _formBuilder = inject(UntypedFormBuilder);
  private readonly _messageService = inject(MessageService);

  private readonly _catalogService = inject(CatalogService);
  private readonly _unsubscribeAll: Subject<any> = new Subject<any>();

  catalogForm: FormGroup;

  catalogId: number = 0;
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

  constructor() {
    this.catalogForm = this._formBuilder.group({
      name: ['', [Validators.required]],
      key: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    const catalogId = this._route.snapshot.paramMap.get('id');

    if (catalogId) {
      this.catalogId = +catalogId;
      this.getCatalog(Number(catalogId));
    }
  }

  getCatalog(catalogId: number) {
    this._catalogService
      .showCatalog(catalogId)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: Catalog) => this.setFormValue(response),
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

    const form: CatalogDto = {
      name,
      key,
    };

    if (this.catalogId) {
      this.updateCatalog(form);
      return;
    }

    this.saveCatalog(form);
  }

  saveCatalog(form: CatalogDto) {
    this._catalogService
      .saveCatalog(form)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: () => this.handleSuccess(),
        error: (err) => this.handleError(err),
      });
  }

  updateCatalog(form: CatalogDto) {
    this._catalogService
      .updateCatalog(this.catalogId, form)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: () => this.handleSuccess(),
        error: (err) => this.handleError(err),
      });
  }

  handleSuccess() {
    this.catalogForm.reset();
    this._router.navigateByUrl('/admin/catalogs');
  }

  handleError(error: any) {
    if (error.status === 400) {
      this._messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Algunos campos son requeridos',
        life: 3000,
      });
      // const errors = error.error;
      // for (let key in errors) {
      //   this.catalogForm.get(key)?.setErrors({
      //     error: errors[key],
      //   });
      // }
    }
    // this.catalogForm.markAllAsTouched();
    // this.catalogForm.setErrors({
    //   error: 'Error al guardar el catalogo',
    // });

    // console.log(this.catalogForm.errors);
  }

  checkErrors(field: string): string {
    const form: any = this.catalogForm.get(field);

    if (form.invalid && (form.dirty || form.touched)) {
      if (form?.hasError('required')) {
        return 'Campo requerido';
      }

      // if (form?.hasError('error')) {
      //   return 'Campo es requerido from db';
      // }
    }
    return '';
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
