import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePasswordUserComponent } from './changepassworduser.component';

describe('ChangePasswordUserComponent', () => {
  let component: ChangePasswordUserComponent;
  let fixture: ComponentFixture<ChangePasswordUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangePasswordUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePasswordUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
