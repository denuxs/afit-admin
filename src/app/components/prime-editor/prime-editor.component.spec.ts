import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimeEditorComponent } from './prime-editor.component';

describe('PrimeEditorComponent', () => {
  let component: PrimeEditorComponent;
  let fixture: ComponentFixture<PrimeEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrimeEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrimeEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
