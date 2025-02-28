import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { EquipmentDto } from 'app/domain';
import { EquipmentService } from 'app/services';

@Component({
  selector: 'app-equipments-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './equipments-form.component.html',
  styleUrl: './equipments-form.component.scss',
})
export class EquipmentsFormComponent implements OnInit {
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  private readonly _formBuilder = inject(FormBuilder);

  private readonly _equipmentService = inject(EquipmentService);
  private readonly _unsubscribeAll: Subject<any> = new Subject<any>();

  equipmentForm: FormGroup;

  equipmentId: number = 0;

  constructor() {
    this.equipmentForm = this._formBuilder.group({
      name: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    const equipmentId = this._route.snapshot.paramMap.get('id');
    if (equipmentId) {
      this.equipmentId = +equipmentId;
      this.getEquipment(+equipmentId);
    }
  }

  getEquipment(equipmentId: number) {
    this._equipmentService
      .showEquipment(equipmentId)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: any) => {
          const form = {
            name: response.name,
          };
          this.equipmentForm.patchValue(form);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  handleSubmit(): void {
    if (this.equipmentForm.invalid) {
      this.equipmentForm.markAllAsTouched();
      return;
    }

    const { name } = this.equipmentForm.value;

    const form: EquipmentDto = {
      name,
    };

    if (this.equipmentId) {
      this.update(form);
    } else {
      this.save(form);
    }
  }

  save(form: EquipmentDto) {
    this._equipmentService
      .saveEquipment(form)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: () => {
          this._router.navigateByUrl('/admin/equipments');
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  update(form: EquipmentDto) {
    this._equipmentService
      .updateEquipment(this.equipmentId, form)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: () => {
          this._router.navigateByUrl('/admin/equipments');
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  checkErrors(field: string): string {
    const form: any = this.equipmentForm.get(field);

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
