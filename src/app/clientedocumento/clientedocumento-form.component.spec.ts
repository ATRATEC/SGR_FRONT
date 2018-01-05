import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteDocumentoFormComponent } from './clientedocumento-form.component';

describe('ClienteDocumentoFormComponent', () => {
  let component: ClienteDocumentoFormComponent;
  let fixture: ComponentFixture<ClienteDocumentoFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClienteDocumentoFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClienteDocumentoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
