import { TestBed, inject } from '@angular/core/testing';

import { ManifestoServicoService } from './manifesto.service';

describe('ManifestoServicoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ManifestoServicoService]
    });
  });

  it('should be created', inject([ManifestoServicoService], (service: ManifestoServicoService) => {
    expect(service).toBeTruthy();
  }));
});
