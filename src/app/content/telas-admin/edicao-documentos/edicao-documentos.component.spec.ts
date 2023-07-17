import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdicaoDocumentosComponent } from './edicao-documentos.component';

describe('EdicaoDocumentosComponent', () => {
  let component: EdicaoDocumentosComponent;
  let fixture: ComponentFixture<EdicaoDocumentosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EdicaoDocumentosComponent]
    });
    fixture = TestBed.createComponent(EdicaoDocumentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
