import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroClienteFormComponent } from './filtrocliente-form.component';

describe('FiltroClienteFormComponent', () => {
  let component: FiltroClienteFormComponent;
  let fixture: ComponentFixture<FiltroClienteFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltroClienteFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroClienteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
