import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroRelatorioFormComponent } from './filtrorelatorio-form.component';

describe('FiltroRelatorioFormComponent', () => {
  let component: FiltroRelatorioFormComponent;
  let fixture: ComponentFixture<FiltroRelatorioFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltroRelatorioFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroRelatorioFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
