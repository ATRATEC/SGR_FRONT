import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteDocumentoListComponent } from './clientedocumento-list.component';

describe('ClienteDocumentoComponent', () => {
  let component: ClienteDocumentoListComponent;
  let fixture: ComponentFixture<ClienteDocumentoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClienteDocumentoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClienteDocumentoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
