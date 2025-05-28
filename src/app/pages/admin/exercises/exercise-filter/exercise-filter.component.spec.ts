import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseFilterComponent } from './exercise-filter.component';

describe('ExerciseFilterComponent', () => {
  let component: ExerciseFilterComponent;
  let fixture: ComponentFixture<ExerciseFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExerciseFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
