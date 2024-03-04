import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasAberturaCivilComponent } from './datas-abertura-civil.component';

describe('DatasAberturaCivilComponent', () => {
  let component: DatasAberturaCivilComponent;
  let fixture: ComponentFixture<DatasAberturaCivilComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DatasAberturaCivilComponent]
    });
    fixture = TestBed.createComponent(DatasAberturaCivilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
