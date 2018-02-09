import { TestBed, inject } from '@angular/core/testing';

import { RelatorioService } from './relatorio.service';

describe('RelatorioService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RelatorioService]
    });
  });

  it('should be created', inject([RelatorioService], (service: RelatorioService) => {
    expect(service).toBeTruthy();
  }));
});
