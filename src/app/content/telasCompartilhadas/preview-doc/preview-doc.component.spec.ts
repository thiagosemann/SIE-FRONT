import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewDocComponent } from './preview-doc.component';

describe('PreviewDocComponent', () => {
  let component: PreviewDocComponent;
  let fixture: ComponentFixture<PreviewDocComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PreviewDocComponent]
    });
    fixture = TestBed.createComponent(PreviewDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
