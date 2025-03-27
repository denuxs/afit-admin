import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import { debounceTime, distinctUntilChanged, Observable } from 'rxjs';
import { RouterLink } from '@angular/router';

import { Catalog } from 'app/domain';
import { CatalogService } from 'app/services';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-catalogs',
  standalone: true,
  imports: [NgIf, AsyncPipe, DatePipe, RouterLink, ReactiveFormsModule],
  templateUrl: './catalogs.component.html',
  styleUrl: './catalogs.component.scss',
})
export class CatalogsComponent implements OnInit {
  private readonly _catalogService = inject(CatalogService);
  private readonly _formBuilder = inject(FormBuilder);

  catalogs$!: Observable<Catalog[]>;
  searchControl = new FormControl();

  catalogTypes: any = [
    {
      name: 'Musculo',
      id: 'muscle',
    },
    {
      name: 'Equipo',
      id: 'equipment',
    },
  ];

  filterForm!: FormGroup;

  ngOnInit(): void {
    this.buildForm();

    this.fetchCatalogs();

    // this.searchControl.valueChanges
    //   .pipe(debounceTime(500), distinctUntilChanged())
    //   .subscribe((query: any) => {
    //     this.fetchCatalogs(query);
    //   });
  }

  buildForm() {
    this.filterForm = this._formBuilder.group({
      search: ['', []],
      key: ['', []],
    });
  }

  handleFilter() {
    const params = this.filterForm.getRawValue();
    this.fetchCatalogs(params);
  }

  fetchCatalogs(params?: any): void {
    this.catalogs$ = this._catalogService.fetchCatalogs({
      ordering: 'key',
      ...params,
    });
  }
}
