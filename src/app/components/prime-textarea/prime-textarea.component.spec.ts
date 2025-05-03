import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimeTextareaComponent } from './prime-textarea.component';

describe('PrimeTextareaComponent', () => {
  let component: PrimeTextareaComponent;
  let fixture: ComponentFixture<PrimeTextareaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrimeTextareaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrimeTextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
