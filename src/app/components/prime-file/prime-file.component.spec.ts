import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimeFileComponent } from './prime-file.component';

describe('PrimeFileComponent', () => {
  let component: PrimeFileComponent;
  let fixture: ComponentFixture<PrimeFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrimeFileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrimeFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
