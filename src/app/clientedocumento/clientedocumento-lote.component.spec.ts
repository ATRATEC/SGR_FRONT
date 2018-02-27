import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteDocumentoLoteComponent } from './clientedocumento-form.component';

describe('ClienteDocumentoLoteComponent', () => {
  let component: ClienteDocumentoLoteComponent;
  let fixture: ComponentFixture<ClienteDocumentoLoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClienteDocumentoLoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClienteDocumentoLoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
