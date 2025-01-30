import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAlertComponent } from './client-alert.component';

describe('ClientAlertComponent', () => {
  let component: ClientAlertComponent;
  let fixture: ComponentFixture<ClientAlertComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClientAlertComponent]
    });
    fixture = TestBed.createComponent(ClientAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
