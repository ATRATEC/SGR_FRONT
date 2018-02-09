import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContratoFornecedorFindComponent } from './contratofornecedor-find.component';

describe('ContratoFornecedorFindComponent', () => {
  let component: ContratoFornecedorFindComponent;
  let fixture: ComponentFixture<ContratoFornecedorFindComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContratoFornecedorFindComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContratoFornecedorFindComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
