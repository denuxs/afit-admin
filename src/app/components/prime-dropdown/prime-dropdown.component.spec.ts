import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimeDropdownComponent } from './prime-dropdown.component';

describe('PrimeDropdownComponent', () => {
  let component: PrimeDropdownComponent;
  let fixture: ComponentFixture<PrimeDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrimeDropdownComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrimeDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
