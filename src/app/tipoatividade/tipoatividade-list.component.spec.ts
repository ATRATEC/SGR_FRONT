import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoAtividadeListComponent } from './tipoatividade-list.component';

describe('TipoAtividadeComponent', () => {
  let component: TipoAtividadeListComponent;
  let fixture: ComponentFixture<TipoAtividadeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipoAtividadeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoAtividadeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
