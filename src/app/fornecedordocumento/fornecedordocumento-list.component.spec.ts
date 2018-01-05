import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FornecedorDocumentoListComponent } from './fornecedordocumento-list.component';

describe('FornecedorDocumentoComponent', () => {
  let component: FornecedorDocumentoListComponent;
  let fixture: ComponentFixture<FornecedorDocumentoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FornecedorDocumentoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FornecedorDocumentoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
