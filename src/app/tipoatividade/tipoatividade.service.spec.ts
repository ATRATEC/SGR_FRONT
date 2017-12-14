import { TestBed, inject } from '@angular/core/testing';

import { TipoAtividadeService } from './tipoatividade.service';

describe('TipoAtividadeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TipoAtividadeService]
    });
  });

  it('should be created', inject([TipoAtividadeService], (service: TipoAtividadeService) => {
    expect(service).toBeTruthy();
  }));
});
