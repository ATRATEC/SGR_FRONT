import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PesagemListComponent } from './pesagem-list.component';

describe('PesagemComponent', () => {
  let component: PesagemListComponent;
  let fixture: ComponentFixture<PesagemListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PesagemListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PesagemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
