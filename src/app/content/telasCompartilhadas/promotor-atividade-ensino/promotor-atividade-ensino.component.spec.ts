import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotorAtividadeEnsinoComponent } from './promotor-atividade-ensino.component';

describe('PromotorAtividadeEnsinoComponent', () => {
  let component: PromotorAtividadeEnsinoComponent;
  let fixture: ComponentFixture<PromotorAtividadeEnsinoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PromotorAtividadeEnsinoComponent]
    });
    fixture = TestBed.createComponent(PromotorAtividadeEnsinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
