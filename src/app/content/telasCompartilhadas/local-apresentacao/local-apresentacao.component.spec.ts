import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalApresentacaoComponent } from './local-apresentacao.component';

describe('LocalApresentacaoComponent', () => {
  let component: LocalApresentacaoComponent;
  let fixture: ComponentFixture<LocalApresentacaoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LocalApresentacaoComponent]
    });
    fixture = TestBed.createComponent(LocalApresentacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
