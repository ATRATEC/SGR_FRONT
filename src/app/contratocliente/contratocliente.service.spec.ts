import { TestBed, inject } from '@angular/core/testing';

import { ContratoClienteService } from './contratocliente.service';

describe('ContratoClienteService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContratoClienteService]
    });
  });

  it('should be created', inject([ContratoClienteService], (service: ContratoClienteService) => {
    expect(service).toBeTruthy();
  }));
});
