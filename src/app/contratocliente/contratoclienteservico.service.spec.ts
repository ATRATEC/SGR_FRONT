import { TestBed, inject } from '@angular/core/testing';

import { ContratoClienteServicoService } from './contratocliente.service';

describe('ContratoClienteServicoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContratoClienteServicoService]
    });
  });

  it('should be created', inject([ContratoClienteServicoService], (service: ContratoClienteServicoService) => {
    expect(service).toBeTruthy();
  }));
});
