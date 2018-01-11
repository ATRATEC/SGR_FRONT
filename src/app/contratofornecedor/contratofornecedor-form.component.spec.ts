import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContratoFornecedorFormComponent } from './contratofornecedor-form.component';

describe('ContratoFornecedorFormComponent', () => {
  let component: ContratoFornecedorFormComponent;
  let fixture: ComponentFixture<ContratoFornecedorFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContratoFornecedorFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContratoFornecedorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
