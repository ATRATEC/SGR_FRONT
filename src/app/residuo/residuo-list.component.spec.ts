import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResiduoListComponent } from './residuo-list.component';

describe('ResiduoComponent', () => {
  let component: ResiduoListComponent;
  let fixture: ComponentFixture<ResiduoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResiduoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResiduoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
