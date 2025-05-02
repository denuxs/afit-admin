import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeasureFilterComponent } from './measure-filter.component';

describe('MeasureFilterComponent', () => {
  let component: MeasureFilterComponent;
  let fixture: ComponentFixture<MeasureFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeasureFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeasureFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
