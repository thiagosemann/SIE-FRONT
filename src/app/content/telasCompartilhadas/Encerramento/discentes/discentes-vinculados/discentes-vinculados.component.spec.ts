import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscentesVinculadosComponent } from './discentes-vinculados.component';

describe('DiscentesVinculadosComponent', () => {
  let component: DiscentesVinculadosComponent;
  let fixture: ComponentFixture<DiscentesVinculadosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DiscentesVinculadosComponent]
    });
    fixture = TestBed.createComponent(DiscentesVinculadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
