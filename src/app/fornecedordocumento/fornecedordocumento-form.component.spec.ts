import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FornecedorDocumentoFormComponent } from './fornecedordocumento-form.component';

describe('FornecedorDocumentoFormComponent', () => {
  let component: FornecedorDocumentoFormComponent;
  let fixture: ComponentFixture<FornecedorDocumentoFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FornecedorDocumentoFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FornecedorDocumentoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
