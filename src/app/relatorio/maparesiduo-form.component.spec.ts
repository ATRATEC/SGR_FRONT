import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaResiduoFormComponent } from './maparesiduo-form.component';

describe('MapaResiduoClienteFormComponent', () => {
  let component: MapaResiduoFormComponent;
  let fixture: ComponentFixture<MapaResiduoFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapaResiduoFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapaResiduoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
