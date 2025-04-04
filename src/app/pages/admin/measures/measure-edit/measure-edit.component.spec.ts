import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeasureEditComponent } from './measure-edit.component';

describe('MeasureEditComponent', () => {
  let component: MeasureEditComponent;
  let fixture: ComponentFixture<MeasureEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeasureEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeasureEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
