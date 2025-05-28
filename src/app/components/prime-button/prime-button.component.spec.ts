import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimeButtonComponent } from './prime-button.component';

describe('PrimeButtonComponent', () => {
  let component: PrimeButtonComponent;
  let fixture: ComponentFixture<PrimeButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrimeButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrimeButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
