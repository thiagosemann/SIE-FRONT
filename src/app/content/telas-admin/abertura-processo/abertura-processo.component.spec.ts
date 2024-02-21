import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AberturaProcessoComponent } from './abertura-processo.component';

describe('AberturaProcessoComponent', () => {
  let component: AberturaProcessoComponent;
  let fixture: ComponentFixture<AberturaProcessoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AberturaProcessoComponent]
    });
    fixture = TestBed.createComponent(AberturaProcessoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
