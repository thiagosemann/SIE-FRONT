import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscentesMilitarComponent } from './discentes-militar.component';

describe('DiscentesMilitarComponent', () => {
  let component: DiscentesMilitarComponent;
  let fixture: ComponentFixture<DiscentesMilitarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DiscentesMilitarComponent]
    });
    fixture = TestBed.createComponent(DiscentesMilitarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
