import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitorDocumentoFormComponent } from './monitordocumento-form.component';

describe('MonitorDocumentoFormComponent', () => {
  let component: MonitorDocumentoFormComponent;
  let fixture: ComponentFixture<MonitorDocumentoFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitorDocumentoFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitorDocumentoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
