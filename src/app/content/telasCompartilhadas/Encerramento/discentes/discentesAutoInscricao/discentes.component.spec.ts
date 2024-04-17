import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscentesComponent } from './discentes.component';

describe('DiscentesComponent', () => {
  let component: DiscentesComponent;
  let fixture: ComponentFixture<DiscentesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DiscentesComponent]
    });
    fixture = TestBed.createComponent(DiscentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
