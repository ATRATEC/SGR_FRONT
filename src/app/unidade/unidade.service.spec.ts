import { TestBed, inject } from '@angular/core/testing';

import { UnidadeService } from './unidade.service';

describe('UnidadeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UnidadeService]
    });
  });

  it('should be created', inject([UnidadeService], (service: UnidadeService) => {
    expect(service).toBeTruthy();
  }));
});
