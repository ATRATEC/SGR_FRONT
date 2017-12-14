import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResiduoFormComponent } from './residuo-form.component';

describe('ResiduoFormComponent', () => {
  let component: ResiduoFormComponent;
  let fixture: ComponentFixture<ResiduoFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResiduoFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResiduoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
