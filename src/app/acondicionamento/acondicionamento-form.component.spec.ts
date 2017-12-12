import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcondicionamentoFormComponent } from './acondicionamento-form.component';

describe('AcondicionamentoFormComponent', () => {
  let component: AcondicionamentoFormComponent;
  let fixture: ComponentFixture<AcondicionamentoFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcondicionamentoFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcondicionamentoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
