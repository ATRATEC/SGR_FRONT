import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroMapaResiduoFormComponent } from './filtromaparesiduo-form.component';

describe('FiltroMapaResiduoFormComponent', () => {
  let component: FiltroMapaResiduoFormComponent;
  let fixture: ComponentFixture<FiltroMapaResiduoFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltroMapaResiduoFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroMapaResiduoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
