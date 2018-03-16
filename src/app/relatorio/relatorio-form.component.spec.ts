import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatorioClienteFormComponent } from './relatoriocliente-form.component';

describe('RelatorioClienteFormComponent', () => {
  let component: RelatorioClienteFormComponent;
  let fixture: ComponentFixture<RelatorioClienteFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelatorioClienteFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatorioClienteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
