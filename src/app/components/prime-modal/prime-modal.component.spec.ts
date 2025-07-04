import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimeModalComponent } from './prime-modal.component';

describe('PrimeModalComponent', () => {
  let component: PrimeModalComponent;
  let fixture: ComponentFixture<PrimeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrimeModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrimeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
