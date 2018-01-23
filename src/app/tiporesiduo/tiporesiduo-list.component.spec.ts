import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoResiduoListComponent } from './tiporesiduo-list.component';

describe('TipoResiduoComponent', () => {
  let component: TipoResiduoListComponent;
  let fixture: ComponentFixture<TipoResiduoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipoResiduoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoResiduoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
