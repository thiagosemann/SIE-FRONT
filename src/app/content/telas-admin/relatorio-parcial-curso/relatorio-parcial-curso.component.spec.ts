import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatorioParcialCursoComponent } from './relatorio-parcial-curso.component';

describe('RelatorioParcialCursoComponent', () => {
  let component: RelatorioParcialCursoComponent;
  let fixture: ComponentFixture<RelatorioParcialCursoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RelatorioParcialCursoComponent]
    });
    fixture = TestBed.createComponent(RelatorioParcialCursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
