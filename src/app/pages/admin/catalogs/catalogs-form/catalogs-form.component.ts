import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { CatalogDto } from 'app/domain';
import { CatalogService } from 'app/services';

import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
@Component({
  selector: 'app-catalogs-form',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, SelectModule],
  templateUrl: './catalogs-form.component.html',
  styleUrl: './catalogs-form.component.scss',
})
export class CatalogsFormComponent implements OnInit {
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  private readonly _formBuilder = inject(FormBuilder);

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
        next: (response: any) => {
          const form = {
            name: response.name,
            key: response.key,
          };
          this.catalogForm.patchValue(form);
        },
        error: (err) => {
          console.log(err);
        },
      });
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
      this.update(form);
    } else {
      this.save(form);
    }
  }

  save(form: CatalogDto) {
    this._catalogService
      .saveCatalog(form)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: () => {
          this._router.navigateByUrl('/admin/catalogs');
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  update(form: CatalogDto) {
    this._catalogService
      .updateCatalog(this.catalogId, form)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: () => {
          this._router.navigateByUrl('/admin/catalogs');
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  checkErrors(field: string): string {
    const form: any = this.catalogForm.get(field);

    if (form.invalid && (form.dirty || form.touched)) {
      if (form?.hasError('required')) {
        return 'Value is required';
      }

      // if (form?.hasError('email')) {
      //   return 'Value is invalid';
      // }
    }
    return '';
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
