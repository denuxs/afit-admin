import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutineFilterComponent } from './routine-filter.component';

describe('WorkoutFilterComponent', () => {
  let component: RoutineFilterComponent;
  let fixture: ComponentFixture<RoutineFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoutineFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RoutineFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
