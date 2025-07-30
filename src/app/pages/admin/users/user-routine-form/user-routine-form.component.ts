import { Component, inject, Input, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  CdkDropList,
  CdkDrag,
  moveItemInArray,
} from '@angular/cdk/drag-drop';

import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';

import { RoutineListComponent } from '../routine-list/routine-list.component';
import { Routine } from 'app/interfaces';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-user-routine-form',
  standalone: true,
  imports: [ReactiveFormsModule, CdkDropList, CdkDrag],
  providers: [DialogService],
  templateUrl: './user-routine-form.component.html',
  styleUrl: './user-routine-form.component.scss',
})
export class UserRoutineFormComponent implements OnInit {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _dialogService = inject(DialogService);

  @Input() form!: FormGroup;
  @Input() userRoutines = [];

  ngOnInit(): void {
    if (this.userRoutines) {
      this.setRoutines(this.userRoutines);
    }
  }

  get routines(): FormArray {
    return this.form.get('routines') as FormArray;
  }

  setRoutines(routines: any) {
    for (const item of routines) {
      const formGroup = this._formBuilder.group({
        routine: [item.routine.id, [Validators.required]],
        order: [item.order, [Validators.required]],
        title: [item.routine.title, []],
      });

      this.routines.push(formGroup);
    }
  }

  openRoutineModal(): void {
    const ref = this._dialogService.open(RoutineListComponent, {
      header: 'Rutinas',
      modal: true,
      position: 'top',
      appendTo: 'body',
      closable: true,
      // contentStyle: { height: '300px' },
    });

    ref.onClose.subscribe((data: any) => {
      if (data) {
        this.addRoutine(data);
      }
    });
  }

  addRoutine(item: Routine): void {
    const nextOrder =
      this.routines.length > 0
        ? Math.max(...this.routines.controls.map(c => c.get('order')?.value)) +
          1
        : 1;

    const formGroup: FormGroup = this._formBuilder.group({
      routine: [item.id, [Validators.required]],
      order: [nextOrder, [Validators.required]],
      title: [item.title, []],
    });

    this.routines.push(formGroup);
  }

  handleDragDrop(event: CdkDragDrop<any>) {
    const previousIndex = event.previousIndex;
    const currentIndex = event.currentIndex;

    moveItemInArray(this.routines.controls, previousIndex, currentIndex);

    this.handleOrder();
  }

  handleOrder(): void {
    this.routines.controls.forEach((control, index) => {
      control.get('order')?.setValue(index + 1);
    });
  }

  removeRoutine(index: number): void {
    this.routines.removeAt(index);
    this.handleOrder();
  }
}
