import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomologacaoInscricaoComponent } from './homologacao-inscricao.component';

describe('HomologacaoInscricaoComponent', () => {
  let component: HomologacaoInscricaoComponent;
  let fixture: ComponentFixture<HomologacaoInscricaoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomologacaoInscricaoComponent]
    });
    fixture = TestBed.createComponent(HomologacaoInscricaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
