import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CronogramaTreinamentoComponent } from './cronograma-treinamento.component';

describe('CronogramaTreinamentoComponent', () => {
  let component: CronogramaTreinamentoComponent;
  let fixture: ComponentFixture<CronogramaTreinamentoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CronogramaTreinamentoComponent]
    });
    fixture = TestBed.createComponent(CronogramaTreinamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
