import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientFilterComponent } from './client-filter.component';

describe('ClientFilterComponent', () => {
  let component: ClientFilterComponent;
  let fixture: ComponentFixture<ClientFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
