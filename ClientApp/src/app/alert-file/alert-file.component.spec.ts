import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertFileComponent } from './alert-file.component';

describe('AlertFileComponent', () => {
  let component: AlertFileComponent;
  let fixture: ComponentFixture<AlertFileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlertFileComponent]
    });
    fixture = TestBed.createComponent(AlertFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
