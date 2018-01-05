import { TestBed, inject } from '@angular/core/testing';

import { ClienteDocumentoService } from './clientedocumento.service';

describe('ClienteDocumentoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClienteDocumentoService]
    });
  });

  it('should be created', inject([ClienteDocumentoService], (service: ClienteDocumentoService) => {
    expect(service).toBeTruthy();
  }));
});
