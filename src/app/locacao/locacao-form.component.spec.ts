import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocacaoFormComponent } from './locacao-form.component';

describe('LocacaoFormComponent', () => {
  let component: LocacaoFormComponent;
  let fixture: ComponentFixture<LocacaoFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocacaoFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocacaoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
