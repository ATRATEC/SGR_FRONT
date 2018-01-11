import { TestBed, inject } from '@angular/core/testing';

import { ContratoFornecedorService } from './contratofornecedor.service';

describe('ContratoFornecedorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContratoFornecedorService]
    });
  });

  it('should be created', inject([ContratoFornecedorService], (service: ContratoFornecedorService) => {
    expect(service).toBeTruthy();
  }));
});
