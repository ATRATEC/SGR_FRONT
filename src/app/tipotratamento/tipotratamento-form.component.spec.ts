import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoTratamentoFormComponent } from './tipotratamento-form.component';

describe('TipoTratamentoFormComponent', () => {
  let component: TipoTratamentoFormComponent;
  let fixture: ComponentFixture<TipoTratamentoFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipoTratamentoFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoTratamentoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
