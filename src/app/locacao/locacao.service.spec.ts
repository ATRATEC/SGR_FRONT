import { TestBed, inject } from '@angular/core/testing';

import { LocacaoService } from './locacao.service';

describe('LocacaoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LocacaoService]
    });
  });

  it('should be created', inject([LocacaoService], (service: LocacaoService) => {
    expect(service).toBeTruthy();
  }));
});
