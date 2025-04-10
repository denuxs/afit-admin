import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogCreateComponent } from './catalog-create.component';

describe('CatalogCreateComponent', () => {
  let component: CatalogCreateComponent;
  let fixture: ComponentFixture<CatalogCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
