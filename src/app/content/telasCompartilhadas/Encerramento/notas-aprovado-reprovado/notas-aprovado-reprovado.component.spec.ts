import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotasAprovadoReprovadoComponent } from './notas-aprovado-reprovado.component';

describe('NotasAprovadoReprovadoComponent', () => {
  let component: NotasAprovadoReprovadoComponent;
  let fixture: ComponentFixture<NotasAprovadoReprovadoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotasAprovadoReprovadoComponent]
    });
    fixture = TestBed.createComponent(NotasAprovadoReprovadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
