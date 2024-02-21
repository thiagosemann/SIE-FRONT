import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InscritionComponent } from './inscrition.component';

describe('InscritionComponent', () => {
  let component: InscritionComponent;
  let fixture: ComponentFixture<InscritionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InscritionComponent]
    });
    fixture = TestBed.createComponent(InscritionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
