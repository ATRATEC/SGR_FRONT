import { TestBed, inject } from '@angular/core/testing';

import { ClasseResiduoService } from './classeresiduo.service';

describe('ClasseResiduoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClasseResiduoService]
    });
  });

  it('should be created', inject([ClasseResiduoService], (service: ClasseResiduoService) => {
    expect(service).toBeTruthy();
  }));
});
