import { TestBed, inject } from '@angular/core/testing';

import { ContratoClienteResiduoService } from './contratocliente.service';

describe('ContratoClienteResiduoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContratoClienteResiduoService]
    });
  });

  it('should be created', inject([ContratoClienteResiduoService], (service: ContratoClienteResiduoService) => {
    expect(service).toBeTruthy();
  }));
});
