import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatorioFormComponent } from './relatorio-form.component';

describe('RelatorioFormComponent', () => {
  let component: RelatorioFormComponent;
  let fixture: ComponentFixture<RelatorioFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelatorioFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatorioFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
