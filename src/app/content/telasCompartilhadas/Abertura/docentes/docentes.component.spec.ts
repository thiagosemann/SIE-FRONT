import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocentesComponent } from './docentes.component';

describe('DocentesComponent', () => {
  let component: DocentesComponent;
  let fixture: ComponentFixture<DocentesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocentesComponent]
    });
    fixture = TestBed.createComponent(DocentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
