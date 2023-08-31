import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AberturaDatasCBCComponent } from './abertura-datas-cbc.component';

describe('AberturaDatasCBCComponent', () => {
  let component: AberturaDatasCBCComponent;
  let fixture: ComponentFixture<AberturaDatasCBCComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AberturaDatasCBCComponent]
    });
    fixture = TestBed.createComponent(AberturaDatasCBCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
