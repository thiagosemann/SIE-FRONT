import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreenchimentoAutComponent } from './preenchimento-aut.component';

describe('PreenchimentoAutComponent', () => {
  let component: PreenchimentoAutComponent;
  let fixture: ComponentFixture<PreenchimentoAutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PreenchimentoAutComponent]
    });
    fixture = TestBed.createComponent(PreenchimentoAutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
