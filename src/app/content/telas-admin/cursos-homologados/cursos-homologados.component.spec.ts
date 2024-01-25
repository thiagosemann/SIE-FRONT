import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursosHomologadosComponent } from './cursos-homologados.component';

describe('CursosHomologadosComponent', () => {
  let component: CursosHomologadosComponent;
  let fixture: ComponentFixture<CursosHomologadosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CursosHomologadosComponent]
    });
    fixture = TestBed.createComponent(CursosHomologadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
