import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRoutineFormComponent } from './user-routine-form.component';

describe('UserRoutineFormComponent', () => {
  let component: UserRoutineFormComponent;
  let fixture: ComponentFixture<UserRoutineFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserRoutineFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserRoutineFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
