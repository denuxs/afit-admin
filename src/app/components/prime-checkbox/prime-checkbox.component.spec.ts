import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimeCheckboxComponent } from './prime-checkbox.component';

describe('PrimeCheckboxComponent', () => {
  let component: PrimeCheckboxComponent;
  let fixture: ComponentFixture<PrimeCheckboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrimeCheckboxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrimeCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
