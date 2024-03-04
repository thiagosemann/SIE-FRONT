import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasAberturaComponent } from './datas-abertura.component';

describe('DatasComponent', () => {
  let component: DatasAberturaComponent;
  let fixture: ComponentFixture<DatasAberturaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DatasAberturaComponent]
    });
    fixture = TestBed.createComponent(DatasAberturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
