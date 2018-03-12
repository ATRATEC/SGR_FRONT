import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocacaoListComponent } from './locacao-list.component';

describe('LocacaoComponent', () => {
  let component: LocacaoListComponent;
  let fixture: ComponentFixture<LocacaoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocacaoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocacaoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
