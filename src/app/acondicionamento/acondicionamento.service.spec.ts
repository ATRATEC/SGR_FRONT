import { TestBed, inject } from '@angular/core/testing';

import { AcondicionamentoService } from './acondicionamento.service';

describe('AcondicionamentoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AcondicionamentoService]
    });
  });

  it('should be created', inject([AcondicionamentoService], (service: AcondicionamentoService) => {
    expect(service).toBeTruthy();
  }));
});
