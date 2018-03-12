import { TestBed, inject } from '@angular/core/testing';

import { PesagemService } from './pesagem.service';

describe('PesagemService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PesagemService]
    });
  });

  it('should be created', inject([PesagemService], (service: PesagemService) => {
    expect(service).toBeTruthy();
  }));
});
