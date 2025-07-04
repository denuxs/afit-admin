import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimePasswordComponent } from './prime-password.component';

describe('PrimePasswordComponent', () => {
  let component: PrimePasswordComponent;
  let fixture: ComponentFixture<PrimePasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrimePasswordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrimePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
