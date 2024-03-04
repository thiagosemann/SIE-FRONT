import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VagasCivilComponent } from './vagas-civil.component';

describe('VagasCivilComponent', () => {
  let component: VagasCivilComponent;
  let fixture: ComponentFixture<VagasCivilComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VagasCivilComponent]
    });
    fixture = TestBed.createComponent(VagasCivilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
