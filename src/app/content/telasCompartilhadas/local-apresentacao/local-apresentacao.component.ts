import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CursoService } from '../../../shared/service/objetosCursosService';
import { debounceTime } from 'rxjs/operators';
import { ContentComponent } from '../../content.component';

@Component({
  selector: 'app-local-apresentacao',
  templateUrl: './local-apresentacao.component.html',
  styleUrls: ['./local-apresentacao.component.css']
})
export class LocalApresentacaoComponent implements OnInit, AfterViewInit {
  localForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private cursoService: CursoService,
    private contentComponent: ContentComponent
  ) {
    this.localForm = this.formBuilder.group({
      localAtiBairro: null,
      localAtiRua: null,
      localAtiNumeral: null,
      localAtiNome: null
    });
  }

  ngOnInit() {
    const cursoEscolhido = this.cursoService.getCursoEscolhido();
    if (cursoEscolhido) {
      const propertiesGroup = {
        localAtiBairro: cursoEscolhido.localAtiBairro,
        localAtiRua: cursoEscolhido.localAtiRua,
        localAtiNumeral: cursoEscolhido.localAtiNumeral,
        localAtiNome: cursoEscolhido.localAtiNome
      };
      this.localForm.patchValue(propertiesGroup);
    }
    this.localForm.valueChanges
      .pipe(debounceTime(300))
      .subscribe(() => this.enviarDados());
  }

  ngAfterViewInit() {
      this.isFormValid();
  }

  enviarDados() {
    const propertiesGroup = {
      localAtiBairro: this.localForm.get('localAtiBairro')?.value,
      localAtiRua: this.localForm.get('localAtiRua')?.value,
      localAtiNumeral: this.localForm.get('localAtiNumeral')?.value,
      localAtiNome: this.localForm.get('localAtiNome')?.value
    };
    this.cursoService.setPropertyOnCursosByCursoEscolhidoID(propertiesGroup);
    this.isFormValid();
    console.log(this.cursoService.getCursos())
  }

  isFormValid(): void {
    const formControls = this.localForm.controls;
    for (const controlName in formControls) {
      if (formControls.hasOwnProperty(controlName)) {
        const control = formControls[controlName];
        if (control.invalid || control.value === null) {
          setTimeout(() => {
            this.contentComponent.changeValidityByComponentName(LocalApresentacaoComponent, false);
          });
          return;
        }
      }
    }
    setTimeout(() => {
      this.contentComponent.changeValidityByComponentName(LocalApresentacaoComponent, true);
    });
  }
}
