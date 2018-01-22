import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContratoClienteFindComponent } from './contratocliente-find.component';

describe('ContratoClienteFindComponent', () => {
  let component: ContratoClienteFindComponent;
  let fixture: ComponentFixture<ContratoClienteFindComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContratoClienteFindComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContratoClienteFindComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
