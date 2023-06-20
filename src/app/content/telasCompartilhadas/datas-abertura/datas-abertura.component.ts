import { Component, OnInit,AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CursoService } from '../../../shared/service/objetosCursosService';
import { debounceTime } from 'rxjs/operators';
import { ContentComponent } from '../../content.component';
@Component({
  selector: 'app-inscricao',
  templateUrl: './datas-abertura.component.html',
  styleUrls: ['./datas-abertura.component.css']
})
export class DatasAberturaComponent implements OnInit {
  datasForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private cursoService: CursoService,
    private contentComponent : ContentComponent
  ) {
    this.datasForm = this.formBuilder.group({
      startInscritiondate: null,
      endInscritiondate: null,
      emailInscrition: null,
      processoSeletivoHorario: null,
      startInscritionHorario: null,
      endInscritionHorario: null,
      apresentacaoHorario: null,
      iniCur: null,
      fimCur: null,
      processoSeletivoDate: null
    });
  }

  ngOnInit() {
    const cursoEscolhido = this.cursoService.getCursoEscolhido();
    if (cursoEscolhido) {
      const propertiesGroup = {
        startInscritiondate: cursoEscolhido.startInscritiondate,
        endInscritiondate: cursoEscolhido.endInscritiondate,
        emailInscrition: cursoEscolhido.emailInscrition,
        processoSeletivoHorario: cursoEscolhido.processoSeletivoHorario,
        startInscritionHorario: cursoEscolhido.startInscritionHorario,
        endInscritionHorario: cursoEscolhido.endInscritionHorario,
        apresentacaoHorario: cursoEscolhido.apresentacaoHorario,
        iniCur: cursoEscolhido.iniCur,
        fimCur: cursoEscolhido.fimCur,
        processoSeletivoDate: cursoEscolhido.processoSeletivoDate
      };
      this.datasForm.patchValue(propertiesGroup);
    }
    this.datasForm.valueChanges
    .pipe(debounceTime(300)) // Adicione um atraso de 300ms para evitar chamadas excessivas
    .subscribe(() => {
      this.enviarDados();
    });
  }
  ngAfterInit(){
    this.isFormValid()
  }

  enviarDados() {
     const propertiesGroup = {
      startInscritiondate: this.datasForm.get('startInscritiondate')?.value,
      endInscritiondate: this.datasForm.get('endInscritiondate')?.value,
      emailInscrition: this.datasForm.get('emailInscrition')?.value,
      processoSeletivoHorario: this.datasForm.get('processoSeletivoHorario')?.value,
      startInscritionHorario: this.datasForm.get('startInscritionHorario')?.value,
      endInscritionHorario: this.datasForm.get('endInscritionHorario')?.value,
      apresentacaoHorario: this.datasForm.get('apresentacaoHorario')?.value,
      iniCur: this.datasForm.get('iniCur')?.value,
      fimCur: this.datasForm.get('fimCur')?.value,
      processoSeletivoDate: this.datasForm.get('processoSeletivoDate')?.value
    };
    this.cursoService.setPropertyOnCursosByCursoEscolhidoID(propertiesGroup);
    this.isFormValid()
  }
  isFormValid(): void {
    const formControls = this.datasForm.controls;
    for (const controlName in formControls) {
      if (formControls.hasOwnProperty(controlName)) {
        const control = formControls[controlName];
        if (control.invalid || control.value === null) {
          this.contentComponent.changeValidityByComponentName(DatasAberturaComponent, false);
          return;
        }
      }
    }
    this.contentComponent.changeValidityByComponentName(DatasAberturaComponent, true);
  }
  
  

  
}
