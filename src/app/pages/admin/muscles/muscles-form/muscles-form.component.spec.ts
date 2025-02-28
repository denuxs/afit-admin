import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MusclesFormComponent } from './muscles-form.component';

describe('MusclesFormComponent', () => {
  let component: MusclesFormComponent;
  let fixture: ComponentFixture<MusclesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MusclesFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MusclesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
