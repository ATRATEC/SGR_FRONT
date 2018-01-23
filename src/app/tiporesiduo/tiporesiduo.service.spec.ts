import { TestBed, inject } from '@angular/core/testing';

import { TipoResiduoService } from './tiporesiduo.service';

describe('TipoResiduoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TipoResiduoService]
    });
  });

  it('should be created', inject([TipoResiduoService], (service: TipoResiduoService) => {
    expect(service).toBeTruthy();
  }));
});
