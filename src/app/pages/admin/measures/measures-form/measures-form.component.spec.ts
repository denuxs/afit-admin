import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeasuresFormComponent } from './measures-form.component';

describe('MeasuresFormComponent', () => {
  let component: MeasuresFormComponent;
  let fixture: ComponentFixture<MeasuresFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeasuresFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeasuresFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
