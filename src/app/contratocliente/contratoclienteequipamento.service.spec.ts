import { TestBed, inject } from '@angular/core/testing';

import { ContratoClienteEquipamentoService } from './contratoclienteequipamento.service';

describe('ContratoClienteEquipamentoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContratoClienteEquipamentoService]
    });
  });

  it('should be created', inject([ContratoClienteEquipamentoService], (service: ContratoClienteEquipamentoService) => {
    expect(service).toBeTruthy();
  }));
});
