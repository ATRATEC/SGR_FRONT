import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoTratamentoListComponent } from './tipotratamento-list.component';

describe('TipoTratamentoComponent', () => {
  let component: TipoTratamentoListComponent;
  let fixture: ComponentFixture<TipoTratamentoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipoTratamentoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoTratamentoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
