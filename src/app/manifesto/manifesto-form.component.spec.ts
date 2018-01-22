import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManifestoFormComponent } from './manifesto-form.component';

describe('ManifestoFormComponent', () => {
  let component: ManifestoFormComponent;
  let fixture: ComponentFixture<ManifestoFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManifestoFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManifestoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
