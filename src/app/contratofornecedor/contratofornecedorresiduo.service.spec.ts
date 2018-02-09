import { TestBed, inject } from '@angular/core/testing';

import { ContratoFornecedorResiduoService } from './contratofornecedor.service';

describe('ContratoFornecedorResiduoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContratoFornecedorResiduoService]
    });
  });

  it('should be created', inject([ContratoFornecedorResiduoService], (service: ContratoFornecedorResiduoService) => {
    expect(service).toBeTruthy();
  }));
});
