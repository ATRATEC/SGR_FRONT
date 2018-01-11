import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContratoFornecedorListComponent } from './contratofornecedor-list.component';

describe('ContratoFornecedorComponent', () => {
  let component: ContratoFornecedorListComponent;
  let fixture: ComponentFixture<ContratoFornecedorListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContratoFornecedorListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContratoFornecedorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
