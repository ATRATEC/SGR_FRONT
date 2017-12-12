import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClasseResiduoListComponent } from './classeresiduo-list.component';

describe('ClasseResiduoComponent', () => {
  let component: ClasseResiduoListComponent;
  let fixture: ComponentFixture<ClasseResiduoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClasseResiduoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClasseResiduoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
