import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AberturaDatasGuardaVidasCivilComponent } from './abertura-datas-guarda-vidas-civil.component';

describe('AberturaDatasGuardaVidasCivilComponent', () => {
  let component: AberturaDatasGuardaVidasCivilComponent;
  let fixture: ComponentFixture<AberturaDatasGuardaVidasCivilComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AberturaDatasGuardaVidasCivilComponent]
    });
    fixture = TestBed.createComponent(AberturaDatasGuardaVidasCivilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
