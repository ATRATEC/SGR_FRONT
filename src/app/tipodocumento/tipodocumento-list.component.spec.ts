import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoDocumentoListComponent } from './tipodocumento-list.component';

describe('TipoDocumentoComponent', () => {
  let component: TipoDocumentoListComponent;
  let fixture: ComponentFixture<TipoDocumentoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipoDocumentoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoDocumentoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
