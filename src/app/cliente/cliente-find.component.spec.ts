import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteFindComponent } from './cliente-find.component';

describe('ClienteFindComponent', () => {
  let component: ClienteFindComponent;
  let fixture: ComponentFixture<ClienteFindComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClienteFindComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClienteFindComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
