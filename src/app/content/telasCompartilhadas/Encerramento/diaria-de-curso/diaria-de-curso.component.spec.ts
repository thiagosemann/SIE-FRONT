import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiariaDeCursoComponent } from './diaria-de-curso.component';

describe('DiariaDeCursoComponent', () => {
  let component: DiariaDeCursoComponent;
  let fixture: ComponentFixture<DiariaDeCursoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DiariaDeCursoComponent]
    });
    fixture = TestBed.createComponent(DiariaDeCursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
