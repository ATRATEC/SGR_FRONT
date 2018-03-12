import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocacaoFindComponent } from './locacao-find.component';

describe('LocacaoFindComponent', () => {
  let component: LocacaoFindComponent;
  let fixture: ComponentFixture<LocacaoFindComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocacaoFindComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocacaoFindComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
