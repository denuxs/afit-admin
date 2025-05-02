import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeasureListComponent } from './measure-list.component';

describe('MeasureListComponent', () => {
  let component: MeasureListComponent;
  let fixture: ComponentFixture<MeasureListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeasureListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeasureListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
