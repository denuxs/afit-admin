import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimeSelectComponent } from './prime-select.component';

describe('SelectInputComponent', () => {
  let component: PrimeSelectComponent;
  let fixture: ComponentFixture<PrimeSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrimeSelectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PrimeSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
