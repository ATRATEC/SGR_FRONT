import { TestBed, inject } from '@angular/core/testing';

import { ItemPesagemService } from './itempesagem.service';

describe('ItemPesagemService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ItemPesagemService]
    });
  });

  it('should be created', inject([ItemPesagemService], (service: ItemPesagemService) => {
    expect(service).toBeTruthy();
  }));
});
