import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalNatacaoComponent } from './local-natacao.component';

describe('LocalNatacaoComponent', () => {
  let component: LocalNatacaoComponent;
  let fixture: ComponentFixture<LocalNatacaoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LocalNatacaoComponent]
    });
    fixture = TestBed.createComponent(LocalNatacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
