import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoResiduoFormComponent } from './tiporesiduo-form.component';

describe('TipoResiduoFormComponent', () => {
  let component: TipoResiduoFormComponent;
  let fixture: ComponentFixture<TipoResiduoFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipoResiduoFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoResiduoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
