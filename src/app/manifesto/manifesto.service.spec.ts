import { TestBed, inject } from '@angular/core/testing';

import { ManifestoService } from './manifesto.service';

describe('ManifestoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ManifestoService]
    });
  });

  it('should be created', inject([ManifestoService], (service: ManifestoService) => {
    expect(service).toBeTruthy();
  }));
});
