import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PgeComponent } from './pge.component';

describe('PgeComponent', () => {
  let component: PgeComponent;
  let fixture: ComponentFixture<PgeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PgeComponent]
    });
    fixture = TestBed.createComponent(PgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
