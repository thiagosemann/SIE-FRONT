import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotasNumericaComponent } from './notas-numerica.component';

describe('NotasNumericaComponent', () => {
  let component: NotasNumericaComponent;
  let fixture: ComponentFixture<NotasNumericaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotasNumericaComponent]
    });
    fixture = TestBed.createComponent(NotasNumericaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
