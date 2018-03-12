import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PesagemFormComponent } from './pesagem-form.component';

describe('PesagemFormComponent', () => {
  let component: PesagemFormComponent;
  let fixture: ComponentFixture<PesagemFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PesagemFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PesagemFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
