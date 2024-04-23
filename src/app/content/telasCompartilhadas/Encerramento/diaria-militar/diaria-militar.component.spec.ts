import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiariaMilitarComponent } from './diaria-militar.component';

describe('DiariaMilitarComponent', () => {
  let component: DiariaMilitarComponent;
  let fixture: ComponentFixture<DiariaMilitarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DiariaMilitarComponent]
    });
    fixture = TestBed.createComponent(DiariaMilitarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
