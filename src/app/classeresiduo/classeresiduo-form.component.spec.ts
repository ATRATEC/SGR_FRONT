import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClasseResiduoFormComponent } from './classeresiduo-form.component';

describe('ClasseResiduoFormComponent', () => {
  let component: ClasseResiduoFormComponent;
  let fixture: ComponentFixture<ClasseResiduoFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClasseResiduoFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClasseResiduoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
