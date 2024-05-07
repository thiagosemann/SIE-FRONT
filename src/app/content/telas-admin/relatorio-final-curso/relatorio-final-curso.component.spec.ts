import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatorioFinalCursoComponent } from './relatorio-final-curso.component';

describe('RelatorioFinalCursoComponent', () => {
  let component: RelatorioFinalCursoComponent;
  let fixture: ComponentFixture<RelatorioFinalCursoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RelatorioFinalCursoComponent]
    });
    fixture = TestBed.createComponent(RelatorioFinalCursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
