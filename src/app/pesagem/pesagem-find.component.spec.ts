import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PesagemFindComponent } from './pesagem-find.component';

describe('PesagemFindComponent', () => {
  let component: PesagemFindComponent;
  let fixture: ComponentFixture<PesagemFindComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PesagemFindComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PesagemFindComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
