import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutineCreateComponent } from './routine-create.component';

describe('RoutineCreateComponent', () => {
  let component: RoutineCreateComponent;
  let fixture: ComponentFixture<RoutineCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoutineCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoutineCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
