import { Component, OnInit,AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CursoService } from '../../../../shared/service/objetosCursosService';
import { debounceTime } from 'rxjs/operators';
import { ContentComponent } from '../../../content.component';
import { Curso } from 'src/app/shared/utilitarios/objetoCurso';
import { User } from 'src/app/shared/utilitarios/user';
import { AuthenticationService } from 'src/app/shared/service/authentication';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-datas-abertura-civil',
  templateUrl: './datas-abertura-civil.component.html',
  styleUrls: ['./datas-abertura-civil.component.css']
})
export class DatasAberturaCivilComponent implements OnInit,AfterViewInit {
  datasForm: FormGroup;
  startInscritionMinDate: string;
  endInscritionMinDate: string;
  processoSeletivoMinDate: string;
  iniCurMinDate: string;
  fimCurMinDate: string;
  cursoEscolhido : Curso | undefined;
  user : User | undefined;
  mostrarExplicacaoInscricao1 = false;
  mostrarExplicacaoInscricao2 = false;

  constructor(
    private formBuilder: FormBuilder,
    private cursoService: CursoService,
    private contentComponent : ContentComponent,
    private authenticationService : AuthenticationService,
    private toastr: ToastrService
  ) {
    this.datasForm = this.formBuilder.group({
      startInscritiondate: null,
      endInscritiondate: null,
      linkInscrition: null,
      processoSeletivoHorario: null,
      startInscritionHorario: null,
      endInscritionHorario: null,
      apresentacaoHorario: null,
      divulgacaoInscritiondate: null,
      divulgacaoInscritiondateHorario: null,
      iniCur: null,
      fimCur: null,
      processoSeletivoDate: null,
      anoAtual: null
    });
    this.startInscritionMinDate = this.setMinDate();
    this.endInscritionMinDate = this.setMinDate();
    this.processoSeletivoMinDate = this.setMinDate();
    this.iniCurMinDate = this.setMinDate();
    this.fimCurMinDate = this.setMinDate();
  }

  ngOnInit() {
     this.cursoEscolhido = this.cursoService.getCursoEscolhido();
     this.user = this.authenticationService.getUser()!;
    if (this.cursoEscolhido) {
      const propertiesGroup = {
        startInscritiondate: this.formatDateForSelect(this.cursoEscolhido.startInscritiondate??''),
        endInscritiondate: this.formatDateForSelect(this.cursoEscolhido.endInscritiondate??''),
        linkInscrition: this.cursoEscolhido.linkInscrition,
        divulgacaoInscritiondate: this.formatDateForSelect(this.cursoEscolhido.divulgacaoInscritiondate??''),
        divulgacaoInscritiondateHorario: this.cursoEscolhido.divulgacaoInscritiondateHorario,
        processoSeletivoHorario: this.cursoEscolhido.processoSeletivoHorario,
        startInscritionHorario: this.cursoEscolhido.startInscritionHorario,
        endInscritionHorario: this.cursoEscolhido.endInscritionHorario,
        apresentacaoHorario: this.cursoEscolhido.apresentacaoHorario,
        iniCur: this.formatDateForSelect(this.cursoEscolhido.iniCur??''),
        fimCur: this.formatDateForSelect(this.cursoEscolhido.fimCur??''),
        processoSeletivoDate: this.formatDateForSelect(this.cursoEscolhido.processoSeletivoDate??''),
      };
      this.datasForm.patchValue(propertiesGroup);
    }
    this.datasForm.valueChanges
    .pipe(debounceTime(300)) // Adicione um atraso de 300ms para evitar chamadas excessivas
    .subscribe(() => {
      this.enviarDados();
    });


    // Adicione os observadores aos controles relevantes
    const emailInscritionInput = document.getElementById('linkInscrition');
    if (emailInscritionInput) {
      emailInscritionInput.addEventListener('blur', (event) => {
        const value = (event.target as HTMLInputElement).value;
        
      });
    }
    
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

  toggleExplicacaoInscricao1() {
    this.mostrarExplicacaoInscricao1 = !this.mostrarExplicacaoInscricao1;
  }
  toggleExplicacaoInscricao2() {
    this.mostrarExplicacaoInscricao2 = !this.mostrarExplicacaoInscricao2;
  }
  enviarDados() {
    const today = new Date();

     const propertiesGroup = {
      startInscritiondate: this.formatDateForPtBR(this.datasForm.get('startInscritiondate')?.value),
      endInscritiondate: this.formatDateForPtBR(this.datasForm.get('endInscritiondate')?.value),
      linkInscrition: this.datasForm.get('linkInscrition')?.value,
      processoSeletivoHorario: this.datasForm.get('processoSeletivoHorario')?.value,
      startInscritionHorario: this.datasForm.get('startInscritionHorario')?.value,
      endInscritionHorario: this.datasForm.get('endInscritionHorario')?.value,
      apresentacaoHorario: this.datasForm.get('apresentacaoHorario')?.value,
      divulgacaoInscritiondate: this.datasForm.get('divulgacaoInscritiondate')?.value,
      divulgacaoInscritiondateHorario: this.datasForm.get('divulgacaoInscritiondateHorario')?.value,
      iniCur: this.formatDateForPtBR(this.datasForm.get('iniCur')?.value),
      fimCur: this.formatDateForPtBR(this.datasForm.get('fimCur')?.value),
      processoSeletivoDate: this.formatDateForPtBR(this.datasForm.get('processoSeletivoDate')?.value),
      anoAtual: today.getFullYear().toString()
    };
    this.cursoService.setPropertyOnCursosByCursoEscolhidoID(propertiesGroup);
    this.cursoService.setDatasAbertura()
    this.isFormValid()
  }
  isFormValid(): void {
    const formControls = this.datasForm.controls;
    for (const controlName in formControls) {
      if (formControls.hasOwnProperty(controlName) && controlName !== 'anoAtual') {
        const control = formControls[controlName];
        if (control.invalid || control.value === null) {

          this.contentComponent.changeValidityByComponentName(DatasAberturaCivilComponent, false);
          return;
        }
      }
    }
    this.contentComponent.changeValidityByComponentName(DatasAberturaCivilComponent, true);
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
    if (this.shouldApplyDateFilter()) {
      const today = new Date();
      return this.formatDate(today);
    } else {
      return '';
    }
  }
  


  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  changeStartInscritiondate(startInscritionDate: string) {
    if (this.shouldApplyDateFilter()) {
      const minDate = new Date(startInscritionDate);
      minDate.setDate(minDate.getDate() + 2);
      this.endInscritionMinDate = this.formatDate(minDate);
      this.processoSeletivoMinDate = this.formatDate(minDate);
      this.iniCurMinDate = this.formatDate(minDate);
      this.fimCurMinDate = this.formatDate(minDate);
  
      this.datasForm.patchValue({
        endInscritiondate: '',
        processoSeletivoDate: '',
        iniCur: '',
        fimCur: '',
      });
  
      this.datasForm.updateValueAndValidity();
    }
  }
  
  changeEndInscritiondate(endInscritionDate: string) {
    if (this.shouldApplyDateFilter()) {
      const minDate = new Date(endInscritionDate);
      minDate.setDate(minDate.getDate() + 2);
      this.processoSeletivoMinDate = this.formatDate(minDate);
      this.iniCurMinDate = this.formatDate(minDate);
      this.fimCurMinDate = this.formatDate(minDate);
  
      this.datasForm.patchValue({
        processoSeletivoDate: '',
        iniCur: '',
        fimCur: '',
      });
  
      this.datasForm.updateValueAndValidity();
    }
  }
  
  changeProcessoSeletivo(processoSeletivoDate: string) {
    if (this.shouldApplyDateFilter()) {
      const minDate = new Date(processoSeletivoDate);
      minDate.setDate(minDate.getDate() + 2);
      this.iniCurMinDate = this.formatDate(minDate);
      this.fimCurMinDate = this.formatDate(minDate);
  
      this.datasForm.patchValue({
        iniCur: '',
        fimCur: '',
      });
  
      this.datasForm.updateValueAndValidity();
    }
  }
  
  changeIniCur(iniCurDate: string) {
    if (this.shouldApplyDateFilter()) {
      const days = Number(this.cursoEscolhido?.haCurso)/8 +1;
      const minDate = new Date(iniCurDate);
      minDate.setDate(minDate.getDate() + days);
      this.fimCurMinDate = this.formatDate(minDate);
  
      this.datasForm.patchValue({
        fimCur: '',
      });
  
      this.datasForm.updateValueAndValidity();
    }
  }
  
  shouldApplyDateFilter(): boolean {
    if(!this.user?.dateFilter){
      return true
    }else{
      return false
    }
  }


}
