import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimeAvatarComponent } from './prime-avatar.component';

describe('PrimeAvatarComponent', () => {
  let component: PrimeAvatarComponent;
  let fixture: ComponentFixture<PrimeAvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrimeAvatarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrimeAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
