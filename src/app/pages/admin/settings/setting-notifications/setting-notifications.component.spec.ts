import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingNotificationsComponent } from './setting-notifications.component';

describe('SettingNotificationsComponent', () => {
  let component: SettingNotificationsComponent;
  let fixture: ComponentFixture<SettingNotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingNotificationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
