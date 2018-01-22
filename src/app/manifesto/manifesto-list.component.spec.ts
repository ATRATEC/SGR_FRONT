import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManifestoListComponent } from './manifesto-list.component';

describe('ManifestoComponent', () => {
  let component: ManifestoListComponent;
  let fixture: ComponentFixture<ManifestoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManifestoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManifestoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
