import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataEncerramentoComponent } from './data-encerramento.component';

describe('DataEncerramentoComponent', () => {
  let component: DataEncerramentoComponent;
  let fixture: ComponentFixture<DataEncerramentoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DataEncerramentoComponent]
    });
    fixture = TestBed.createComponent(DataEncerramentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
