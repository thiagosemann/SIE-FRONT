import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Logistica1Component } from './logistica1.component';

describe('Logistica1Component', () => {
  let component: Logistica1Component;
  let fixture: ComponentFixture<Logistica1Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Logistica1Component]
    });
    fixture = TestBed.createComponent(Logistica1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
