import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescricoesComplementaresComponent } from './prescricoes-complementares.component';

describe('PrescricoesComplementaresComponent', () => {
  let component: PrescricoesComplementaresComponent;
  let fixture: ComponentFixture<PrescricoesComplementaresComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrescricoesComplementaresComponent]
    });
    fixture = TestBed.createComponent(PrescricoesComplementaresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
