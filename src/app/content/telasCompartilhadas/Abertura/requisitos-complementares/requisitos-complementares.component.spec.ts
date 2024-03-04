import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequisitosComplementaresComponent } from './requisitos-complementares.component';

describe('RequisitosComplementaresComponent', () => {
  let component: RequisitosComplementaresComponent;
  let fixture: ComponentFixture<RequisitosComplementaresComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RequisitosComplementaresComponent]
    });
    fixture = TestBed.createComponent(RequisitosComplementaresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
