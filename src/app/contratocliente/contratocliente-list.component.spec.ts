import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContratoClienteListComponent } from './contratocliente-list.component';

describe('ContratoClienteComponent', () => {
  let component: ContratoClienteListComponent;
  let fixture: ComponentFixture<ContratoClienteListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContratoClienteListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContratoClienteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
