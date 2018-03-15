import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroPesagemFormComponent } from './filtropesagem-form.component';

describe('FiltroPesagemFormComponent', () => {
  let component: FiltroPesagemFormComponent;
  let fixture: ComponentFixture<FiltroPesagemFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltroPesagemFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroPesagemFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
