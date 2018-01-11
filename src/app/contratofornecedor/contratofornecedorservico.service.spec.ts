import { TestBed, inject } from '@angular/core/testing';

import { ContratoFornecedorServicoService } from './contratofornecedor.service';

describe('ContratoFornecedorServicoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContratoFornecedorServicoService]
    });
  });

  it('should be created', inject([ContratoFornecedorServicoService], (service: ContratoFornecedorServicoService) => {
    expect(service).toBeTruthy();
  }));
});
