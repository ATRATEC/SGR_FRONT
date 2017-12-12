import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcondicionamentoListComponent } from './acondicionamento-list.component';

describe('AcondicionamentoComponent', () => {
  let component: AcondicionamentoListComponent;
  let fixture: ComponentFixture<AcondicionamentoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcondicionamentoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcondicionamentoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
