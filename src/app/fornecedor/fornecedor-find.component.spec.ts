import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FornecedorFindComponent } from './fornecedor-find.component';

describe('FornecedorFindComponent', () => {
  let component: FornecedorFindComponent;
  let fixture: ComponentFixture<FornecedorFindComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FornecedorFindComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FornecedorFindComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
