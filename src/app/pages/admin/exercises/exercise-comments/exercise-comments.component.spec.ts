import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseCommentsComponent } from './exercise-comments.component';

describe('ExerciseCommentsComponent', () => {
  let component: ExerciseCommentsComponent;
  let fixture: ComponentFixture<ExerciseCommentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseCommentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExerciseCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
