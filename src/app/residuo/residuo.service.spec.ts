import { TestBed, inject } from '@angular/core/testing';

import { ResiduoService } from './residuo.service';

describe('ResiduoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ResiduoService]
    });
  });

  it('should be created', inject([ResiduoService], (service: ResiduoService) => {
    expect(service).toBeTruthy();
  }));
});
