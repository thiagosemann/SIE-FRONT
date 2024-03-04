import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeiosDivulgacaoComponent } from './meios-divulgacao.component';

describe('MeiosDivulgacaoComponent', () => {
  let component: MeiosDivulgacaoComponent;
  let fixture: ComponentFixture<MeiosDivulgacaoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MeiosDivulgacaoComponent]
    });
    fixture = TestBed.createComponent(MeiosDivulgacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
