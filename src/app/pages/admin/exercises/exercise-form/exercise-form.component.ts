import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Equipment, ExerciseDto, Muscle } from 'app/domain';
import { EquipmentService, ExerciseService, MuscleService } from 'app/services';
import { Observable, Subject, takeUntil } from 'rxjs';
import { QuillEditorComponent } from 'ngx-quill';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-exercise-form',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe, QuillEditorComponent],
  templateUrl: './exercise-form.component.html',
  styleUrl: './exercise-form.component.scss',
})
export class ExerciseFormComponent implements OnInit {
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  private readonly _formBuilder = inject(FormBuilder);

  private readonly _exerciseService = inject(ExerciseService);
  private readonly _equipmentService = inject(EquipmentService);
  private readonly _muscleService = inject(MuscleService);
  private readonly _sanitizer = inject(DomSanitizer);

  private readonly _unsubscribeAll: Subject<any> = new Subject<any>();

  exerciseForm: FormGroup;
  equipments$!: Observable<Equipment[]>;
  muscles$!: Observable<Muscle[]>;

  exerciseId: number = 0;

  constructor() {
    this.exerciseForm = this._formBuilder.group({
      name: ['', [Validators.required]],
      description: [''],
      equipment: ['', []],
      muscle: ['', [Validators.required]],
      sets: [4],
      repts: [10],
    });
  }

  ngOnInit(): void {
    this.getEquipments();
    this.getMuscles();

    const exerciseId = this._route.snapshot.paramMap.get('id');
    if (exerciseId) {
      this.exerciseId = +exerciseId;
      this.getExercise(+exerciseId);
    }
  }

  getExercise(exerciseId: number) {
    this._exerciseService
      .showExercise(exerciseId)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: any) => {
          const form = {
            name: response.name,
            description: response.description,
            equipment: response.equipment?.id,
            muscle: response.muscle.id,
            sets: response.sets,
            repts: response.repts,
          };
          this.exerciseForm.patchValue(form);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  getMuscles() {
    this.muscles$ = this._muscleService.fetchMuscles();
  }

  getEquipments() {
    this.equipments$ = this._equipmentService.fetchEquipments();
  }

  handleSubmit(): void {
    if (this.exerciseForm.invalid) {
      this.exerciseForm.markAllAsTouched();
      return;
    }

    const { name, description, equipment, muscle, sets, repts } =
      this.exerciseForm.value;

    const form: ExerciseDto = {
      name,
      description,
      equipment,
      muscle,
      sets,
      repts,
    };

    if (this.exerciseId) {
      this.update(form);
    } else {
      this.save(form);
    }
  }

  save(form: ExerciseDto) {
    this._exerciseService
      .saveExercise(form)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: () => {
          this._router.navigateByUrl('/admin/exercises');
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  update(form: ExerciseDto) {
    this._exerciseService
      .updateExercise(this.exerciseId, form)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: () => {
          this._router.navigateByUrl('/admin/exercises');
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  checkErrors(field: string): string {
    const form: any = this.exerciseForm.get(field);

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

  byPassHTML(html: string) {
    return this._sanitizer.bypassSecurityTrustHtml(html);
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
