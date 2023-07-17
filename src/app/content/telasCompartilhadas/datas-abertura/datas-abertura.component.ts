import { Component, OnInit,AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CursoService } from '../../../shared/service/objetosCursosService';
import { debounceTime } from 'rxjs/operators';
import { ContentComponent } from '../../content.component';
import { Curso } from 'src/app/shared/utilitarios/objetoCurso';


@Component({
  selector: 'app-inscricao',
  templateUrl: './datas-abertura.component.html',
  styleUrls: ['./datas-abertura.component.css']
})
export class DatasAberturaComponent implements OnInit,AfterViewInit {
  datasForm: FormGroup;
  startInscritionMinDate: string;
  endInscritionMinDate: string;
  processoSeletivoMinDate: string;
  iniCurMinDate: string;
  fimCurMinDate: string;
  cursoEscolhido : Curso | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private cursoService: CursoService,
    private contentComponent : ContentComponent,
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
    this.startInscritionMinDate = this.setMinDate();
    this.endInscritionMinDate = this.setMinDate();
    this.processoSeletivoMinDate = this.setMinDate();
    this.iniCurMinDate = this.setMinDate();
    this.fimCurMinDate = this.setMinDate();
  }

  ngOnInit() {
     this.cursoEscolhido = this.cursoService.getCursoEscolhido();
    if (this.cursoEscolhido) {
      const propertiesGroup = {
        startInscritiondate: this.formatDateForSelect(this.cursoEscolhido.startInscritiondate??''),
        endInscritiondate: this.formatDateForSelect(this.cursoEscolhido.endInscritiondate??''),
        emailInscrition: this.cursoEscolhido.emailInscrition,
        processoSeletivoHorario: this.cursoEscolhido.processoSeletivoHorario,
        startInscritionHorario: this.cursoEscolhido.startInscritionHorario,
        endInscritionHorario: this.cursoEscolhido.endInscritionHorario,
        apresentacaoHorario: this.cursoEscolhido.apresentacaoHorario,
        iniCur: this.formatDateForSelect(this.cursoEscolhido.iniCur??''),
        fimCur: this.formatDateForSelect(this.cursoEscolhido.fimCur??''),
        processoSeletivoDate: this.formatDateForSelect(this.cursoEscolhido.processoSeletivoDate??'')
      };
      this.datasForm.patchValue(propertiesGroup);
      const date = new Date(); 
    }
    this.datasForm.valueChanges
    .pipe(debounceTime(300)) // Adicione um atraso de 300ms para evitar chamadas excessivas
    .subscribe(() => {
      this.enviarDados();
    });

    // Adicione os observadores aos controles relevantes
    this.datasForm.get('startInscritiondate')?.valueChanges.subscribe(value => {
      // Atualize o valor mínimo do endInscritiondate
      this.changeStartInscritiondate(value);
    });

    this.datasForm.get('endInscritiondate')?.valueChanges.subscribe(value => {
      // Atualize o valor mínimo do processoSeletivoDate
      this.changeEndInscritiondate(value);
    });

    this.datasForm.get('processoSeletivoDate')?.valueChanges.subscribe(value => {
      // Atualize o valor mínimo do iniCur
      this.changeProcessoSeletivo(value);
    });

    this.datasForm.get('iniCur')?.valueChanges.subscribe(value => {
      // Atualize o valor mínimo do fimCur
      this.changeIniCur(value);
    });
  }
  ngAfterViewInit(){
    this.isFormValid()
  }

  enviarDados() {
     const propertiesGroup = {
      startInscritiondate: this.formatDateForPtBR(this.datasForm.get('startInscritiondate')?.value),
      endInscritiondate: this.formatDateForPtBR(this.datasForm.get('endInscritiondate')?.value),
      emailInscrition: this.datasForm.get('emailInscrition')?.value,
      processoSeletivoHorario: this.datasForm.get('processoSeletivoHorario')?.value,
      startInscritionHorario: this.datasForm.get('startInscritionHorario')?.value,
      endInscritionHorario: this.datasForm.get('endInscritionHorario')?.value,
      apresentacaoHorario: this.datasForm.get('apresentacaoHorario')?.value,
      iniCur: this.formatDateForPtBR(this.datasForm.get('iniCur')?.value),
      fimCur: this.formatDateForPtBR(this.datasForm.get('fimCur')?.value),
      processoSeletivoDate: this.formatDateForPtBR(this.datasForm.get('processoSeletivoDate')?.value)
      
    };
    this.cursoService.setPropertyOnCursosByCursoEscolhidoID(propertiesGroup);
    this.cursoService.setDatasAbertura()
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

  formatDateForPtBR(date: string): string {
    if (date) {
      const dIni = date.slice(8, 10);
      const mIni = date.slice(5, 7);
      const aIni = date.slice(0, 4);
      return dIni + '/' + mIni + '/' + aIni;
    }
    return '';
  }
  formatDateForSelect(date:string):string{
    let dIni = date[0] + date[1];
    let mIni = date[3] + date[4];
    let aIni = date[6] + date[7] + date[8] + date[9];
    return aIni+'-'+ mIni +'-'+ dIni
  }

  setMinDate(): string {
    const today = new Date();
    return this.formatDate(today);
  }


  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  changeStartInscritiondate(startInscritionDate: string) {
    const minDate = new Date(startInscritionDate);
    minDate.setDate(minDate.getDate() + 2);
    this.endInscritionMinDate = this.formatDate(minDate);
    this.processoSeletivoMinDate = this.formatDate(minDate);
    this.iniCurMinDate = this.formatDate(minDate);
    this.fimCurMinDate = this.formatDate(minDate);

    this.datasForm.patchValue({
      endInscritiondate: null,
      processoSeletivoDate: null,
      iniCur: null,
      fimCur: null,
    });

    this.datasForm.updateValueAndValidity();
  }

  changeEndInscritiondate(endInscritionDate: string) {
    const minDate = new Date(endInscritionDate);
    minDate.setDate(minDate.getDate() + 2);
    this.processoSeletivoMinDate = this.formatDate(minDate);
    this.iniCurMinDate = this.formatDate(minDate);
    this.fimCurMinDate = this.formatDate(minDate);

    this.datasForm.patchValue({
      processoSeletivoDate: null,
      iniCur: null,
      fimCur: null,
    });
    // Atualize o valor mínimo do controle endInscritiondate no formulário
    this.datasForm.updateValueAndValidity();

  }

  changeProcessoSeletivo(processoSeletivoDate: string) {
    const minDate = new Date(processoSeletivoDate);
    minDate.setDate(minDate.getDate() + 2);
    this.iniCurMinDate = this.formatDate(minDate);
    this.fimCurMinDate = this.formatDate(minDate);
    this.datasForm.patchValue({
      iniCur: null,
      fimCur: null,
    });
    // Atualize o valor mínimo do controle endInscritiondate no formulário
    this.datasForm.updateValueAndValidity();

  }

  changeIniCur(iniCurDate: string) {
    const minDate = new Date(iniCurDate);
    if(this.cursoEscolhido){
      const days = (Number(this.cursoEscolhido.haCurso)/8)-1;
      minDate.setDate(minDate.getDate() + days);
    }else{
      const minDate = new Date(iniCurDate);
      minDate.setDate(minDate.getDate() + 2);
    }
    this.datasForm.patchValue({
      fimCur: null,
    });

    this.fimCurMinDate = this.formatDate(minDate);

    // Atualize o valor mínimo do controle fimCur no formulário
    this.datasForm.updateValueAndValidity();
  }
  clearInputs(){

  }
}


  
  
  

  

