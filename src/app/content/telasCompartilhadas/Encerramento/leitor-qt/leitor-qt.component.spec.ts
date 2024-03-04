import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeitorQTComponent } from './leitor-qt.component';

describe('LeitorQTComponent', () => {
  let component: LeitorQTComponent;
  let fixture: ComponentFixture<LeitorQTComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LeitorQTComponent]
    });
    fixture = TestBed.createComponent(LeitorQTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
