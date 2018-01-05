import { TestBed, inject } from '@angular/core/testing';

import { FornecedorDocumentoService } from './fornecedordocumento.service';

describe('FornecedorDocumentoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FornecedorDocumentoService]
    });
  });

  it('should be created', inject([FornecedorDocumentoService], (service: FornecedorDocumentoService) => {
    expect(service).toBeTruthy();
  }));
});
