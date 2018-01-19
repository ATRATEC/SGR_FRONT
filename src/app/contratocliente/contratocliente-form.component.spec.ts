import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContratoClienteFormComponent } from './contratocliente-form.component';

describe('ContratoClienteFormComponent', () => {
  let component: ContratoClienteFormComponent;
  let fixture: ComponentFixture<ContratoClienteFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContratoClienteFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContratoClienteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
