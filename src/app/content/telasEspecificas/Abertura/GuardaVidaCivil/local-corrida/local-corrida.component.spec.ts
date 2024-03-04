import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalCorridaComponent } from './local-corrida.component';

describe('LocalCorridaComponent', () => {
  let component: LocalCorridaComponent;
  let fixture: ComponentFixture<LocalCorridaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LocalCorridaComponent]
    });
    fixture = TestBed.createComponent(LocalCorridaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
