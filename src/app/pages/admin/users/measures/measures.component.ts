import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import { Observable } from 'rxjs';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Measure } from 'app/domain';
import { MeasuresService } from 'app/services';
import { YesNoPipe } from 'app/pipes/yes-no.pipe';

import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { faSolidCircleCheck } from '@ng-icons/font-awesome/solid';

@Component({
  selector: 'app-measures',
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe,
    ReactiveFormsModule,
    RouterLink,
    TableModule,
    TooltipModule,
    YesNoPipe,
    TagModule,
    NgIcon,
    ToastModule,
    ToastModule,
    ConfirmDialogModule,
  ],
  providers: [ConfirmationService, provideIcons({ faSolidCircleCheck })],
  templateUrl: './measures.component.html',
  styleUrl: './measures.component.scss',
})
export class MeasuresComponent implements OnInit {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _measureService = inject(MeasuresService);

  private readonly _confirmationService = inject(ConfirmationService);
  private readonly _route = inject(ActivatedRoute);

  measures$!: Observable<Measure[]>;

  filterForm: FormGroup;
  userId!: number;

  constructor() {
    this.filterForm = this._formBuilder.group({
      search: ['', []],
    });
  }

  ngOnInit(): void {
    const userId = this._route.snapshot.paramMap.get('userId');
    if (userId) {
      this.userId = +userId;
      const params = { user: this.userId, search: '' };
      this.getMeasures(params);
    }
  }

  getMeasures(params: any): void {
    this.measures$ = this._measureService.fetchMeasures(params);
  }

  handleFilter(): void {
    const { search } = this.filterForm.value;

    const params = { user: this.userId, search };
    this.getMeasures(params);
  }

  handleDelete(id: number) {
    this._confirmationService.confirm({
      message: '¿Está seguro de borrar esta medida?',
      header: 'Eliminar',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancel',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Borrar',
        severity: 'danger',
      },
      accept: () => {
        this._measureService.delete(id).subscribe({
          next: () => {
            const params = { user: this.userId, search: '' };
            this.getMeasures(params);
          },
        });
      },
    });
  }
}
