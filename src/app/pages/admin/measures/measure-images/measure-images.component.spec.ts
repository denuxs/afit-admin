import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeasureImagesComponent } from './measure-images.component';

describe('MeasureImagesComponent', () => {
  let component: MeasureImagesComponent;
  let fixture: ComponentFixture<MeasureImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeasureImagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeasureImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
