import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeasureCreateComponent } from './measure-create.component';

describe('MeasureCreateComponent', () => {
  let component: MeasureCreateComponent;
  let fixture: ComponentFixture<MeasureCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeasureCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeasureCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
