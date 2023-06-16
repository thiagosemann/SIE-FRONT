import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CursoService } from '../../../shared/service/objetosCursosService';

@Component({
  selector: 'app-inscricao',
  templateUrl: './datas-abertura.component.html',
  styleUrls: ['./datas-abertura.component.css']
})
export class DatasAberturaComponent implements OnInit {
  datasForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private cursoService: CursoService
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
  }

  enviarDados() {
    if (this.datasForm.valid) {
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
    }
    console.log(this.cursoService.getCursos());
  }
}
