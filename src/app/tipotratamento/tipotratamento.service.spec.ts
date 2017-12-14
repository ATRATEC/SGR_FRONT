import { TestBed, inject } from '@angular/core/testing';

import { TipoTratamentoService } from './tipotratamento.service';

describe('TipoTratamentoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TipoTratamentoService]
    });
  });

  it('should be created', inject([TipoTratamentoService], (service: TipoTratamentoService) => {
    expect(service).toBeTruthy();
  }));
});
