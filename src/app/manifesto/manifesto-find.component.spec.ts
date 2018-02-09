import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManifestoFindComponent } from './manifesto-find.component';

describe('ManifestoFindComponent', () => {
  let component: ManifestoFindComponent;
  let fixture: ComponentFixture<ManifestoFindComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManifestoFindComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManifestoFindComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
