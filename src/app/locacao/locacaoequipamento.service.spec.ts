import { TestBed, inject } from '@angular/core/testing';

import { LocacaoEquipamentoService } from './locacao.service';

describe('LocacaoEquipamentoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LocacaoEquipamentoService]
    });
  });

  it('should be created', inject([LocacaoEquipamentoService], (service: LocacaoEquipamentoService) => {
    expect(service).toBeTruthy();
  }));
});
