import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NobelliComponent } from './nobelli.component';

describe('NobelliComponent', () => {
  let component: NobelliComponent;
  let fixture: ComponentFixture<NobelliComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NobelliComponent]
    });
    fixture = TestBed.createComponent(NobelliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
