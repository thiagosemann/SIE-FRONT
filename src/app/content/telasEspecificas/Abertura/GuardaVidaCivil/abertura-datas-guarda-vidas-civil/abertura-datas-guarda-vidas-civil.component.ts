import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subject  } from 'rxjs';
import { ContentComponent } from 'src/app/content/content.component';
import { AuthenticationService } from 'src/app/shared/service/authentication';
import { CursoService } from 'src/app/shared/service/objetosCursosService';
import { Curso } from 'src/app/shared/utilitarios/objetoCurso';
import { User } from 'src/app/shared/utilitarios/user';
import { takeUntil  } from 'rxjs/operators';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-abertura-datas-guarda-vidas-civil',
  templateUrl: './abertura-datas-guarda-vidas-civil.component.html',
  styleUrls: ['./abertura-datas-guarda-vidas-civil.component.css']
})
export class AberturaDatasGuardaVidasCivilComponent implements OnInit,AfterViewInit {
  datasGuardaVidaForm: FormGroup;
  private unsubscribe$ = new Subject<void>();

  datasMinProprieties = [
    'startInscritiondate',
    'endInscritiondate',
    'divulgacaoInscritiondate',
    'tafDateNatacao',
    'tafDateCorrida',
    'divulgacaoPhysicalAptitudeTestDate',
    'startDocumentSubmissionDate',
    'divulgacaoDocumentSubmissionDate',
    'startFinalResultsDate',
    'iniCur',
    'fimCur'
  ];
  datasMin = ['','','','','','','','','','','',''];
  user : User | undefined;
  cursoEscolhido : Curso | undefined;


  constructor(
    private formBuilder: FormBuilder,
    private cursoService: CursoService,
    private contentComponent : ContentComponent,
    private authenticationService : AuthenticationService,
    private toastr: ToastrService

  ) {
    this.datasGuardaVidaForm = this.formBuilder.group({
      startInscritiondate: null,
      endInscritiondate:null,
      divulgacaoInscritiondate:null,
      startDocumentSubmissionDate:null,
      divulgacaoDocumentSubmissionDate:null,
      startFinalResultsDate:null,
      iniCur:null,
      fimCur:null,
      tafDateNatacao:null,
      tafDateCorrida:null,
      divulgacaoPhysicalAptitudeTestDate:null,
      startInscritionHorario:null,
      endInscritionHorario:null,
      divulgacaoInscritiondateHorario:null,
      tafHNatacao:null,
      tafHCorrida:                        null,
      divulgacaoPhysicalAptitudeTestTime: null,
      startDocumentSubmissionTime:        null,
      divulgacaoDocumentSubmissionTime:   null,
      startFinalResultsTime:              null,
      apresentacaoHorario:               null,

    });
  }

  ngOnInit() {
    for (let i = 0; i < this.datasMin.length; i++) {
      this.datasMin[i] = this.setMinDate();
    }
    this.cursoEscolhido = this.cursoService.getCursoEscolhido();
    this.user = this.authenticationService.getUser()!;
   
    if (this.cursoEscolhido) {
      const propertiesGroup = {
      startInscritiondate:                this.formatDateForSelect(this.cursoEscolhido.startInscritiondate??''),
      endInscritiondate:                  this.formatDateForSelect(this.cursoEscolhido.endInscritiondate??''),
      divulgacaoInscritiondate:           this.formatDateForSelect(this.cursoEscolhido.divulgacaoInscritiondate??''),
      startDocumentSubmissionDate:        this.formatDateForSelect(this.cursoEscolhido.startDocumentSubmissionDate??''),
      divulgacaoDocumentSubmissionDate:   this.formatDateForSelect(this.cursoEscolhido.divulgacaoDocumentSubmissionDate??''),
      startFinalResultsDate:              this.formatDateForSelect(this.cursoEscolhido.startFinalResultsDate??''),
      iniCur:                             this.formatDateForSelect(this.cursoEscolhido.iniCur??''),
      fimCur:                             this.formatDateForSelect(this.cursoEscolhido.fimCur??''),
      tafDateNatacao:                     this.formatDateForSelect(this.cursoEscolhido.tafDateNatacao??''),
      tafDateCorrida:                     this.formatDateForSelect(this.cursoEscolhido.tafDateCorrida??''),
      divulgacaoPhysicalAptitudeTestDate: this.formatDateForSelect(this.cursoEscolhido.divulgacaoPhysicalAptitudeTestDate??''),
      divulgacaoInscritiondateHorario:    this.cursoEscolhido.divulgacaoInscritiondateHorario,
      startInscritionHorario:             this.cursoEscolhido.startInscritionHorario,
      endInscritionHorario:               this.cursoEscolhido.endInscritionHorario,
      tafHNatacao:                        this.cursoEscolhido.tafHNatacao,
      tafHCorrida:                        this.cursoEscolhido.tafHCorrida,
      divulgacaoPhysicalAptitudeTestTime: this.cursoEscolhido.divulgacaoPhysicalAptitudeTestTime,
      startDocumentSubmissionTime:        this.cursoEscolhido.startDocumentSubmissionTime,
      divulgacaoDocumentSubmissionTime:   this.cursoEscolhido.divulgacaoDocumentSubmissionTime,
      startFinalResultsTime:              this.cursoEscolhido.startFinalResultsTime,
      apresentacaoHorario:                this.cursoEscolhido.apresentacaoHorario,
      };
      this.datasGuardaVidaForm.patchValue(propertiesGroup);
    }
    this.datasGuardaVidaForm.valueChanges
    .pipe(debounceTime(300))
    .subscribe(() => {
      this.enviarDados();
    });

    for (const prop of this.datasMinProprieties) {
      this.subscribeToDateChanges(prop);
    }
  
  }

  private subscribeToDateChanges(propertyName: string) {
    this.datasGuardaVidaForm.get(propertyName)?.valueChanges.subscribe(value => {
      const index = this.datasMinProprieties.indexOf(propertyName);
      this.changeDates(index);
    });
  }
  
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngAfterViewInit(){
    this.isFormValid()
  }
  changeDates(id: number) {
      if (this.shouldApplyDateFilter()) {
        const minDate = new Date(this.datasGuardaVidaForm.get(this.datasMinProprieties[id])?.value);
        minDate.setDate(minDate.getDate() + 2);

        // Desinscrever os observáveis antes de chamar setValue('')
        this.unsubscribe$.next();

        for (let i = id; i < this.datasMin.length; i++) {
          console.log(this.formatDate(minDate));
          this.datasMin[i] = this.formatDate(minDate);
          if(i!=id){
            this.datasGuardaVidaForm.get(this.datasMinProprieties[i])?.setValue('', { emitEvent: false });
          }
        }

      // Reinscrever os observáveis após a alteração
      this.subscribeToValueChanges();
    }
  }

  private subscribeToValueChanges() {
    this.datasGuardaVidaForm.get('startInscritiondate')?.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(value => {
        this.changeDates(0);
      });
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

  shouldApplyDateFilter(): boolean {
    if(!this.user?.dateFilter){
      return true
    }else{
      return false
    }
  }

  formatDateForSelect(date:string):string{
    let dIni = date[0] + date[1];
    let mIni = date[3] + date[4];
    let aIni = date[6] + date[7] + date[8] + date[9];
    return aIni+'-'+ mIni +'-'+ dIni
  }

  enviarDados() {
    const today = new Date();
    const propertiesGroup = {
      startInscritiondate:               this.formatDateForPtBR(this.datasGuardaVidaForm.get('startInscritiondate')?.value),
      endInscritiondate:                 this.formatDateForPtBR(this.datasGuardaVidaForm.get('endInscritiondate')?.value),
      divulgacaoInscritiondate:          this.formatDateForPtBR(this.datasGuardaVidaForm.get('divulgacaoInscritiondate')?.value),
      startDocumentSubmissionDate:       this.formatDateForPtBR(this.datasGuardaVidaForm.get('startDocumentSubmissionDate')?.value),
      divulgacaoDocumentSubmissionDate:  this.formatDateForPtBR(this.datasGuardaVidaForm.get('divulgacaoDocumentSubmissionDate')?.value),
      startFinalResultsDate:             this.formatDateForPtBR(this.datasGuardaVidaForm.get('startFinalResultsDate')?.value),
      iniCur:                            this.formatDateForPtBR(this.datasGuardaVidaForm.get('iniCur')?.value),
      fimCur:                            this.formatDateForPtBR(this.datasGuardaVidaForm.get('fimCur')?.value),
      tafDateNatacao:                    this.formatDateForPtBR(this.datasGuardaVidaForm.get('tafDateNatacao')?.value),
      tafDateCorrida:                    this.formatDateForPtBR(this.datasGuardaVidaForm.get('tafDateCorrida')?.value),
      divulgacaoPhysicalAptitudeTestDate:this.formatDateForPtBR(this.datasGuardaVidaForm.get('divulgacaoPhysicalAptitudeTestDate')?.value),
      tafHNatacao:                       this.datasGuardaVidaForm.get('tafHNatacao')?.value,
      tafHCorrida:                       this.datasGuardaVidaForm.get('tafHCorrida')?.value,
      divulgacaoPhysicalAptitudeTestTime:this.datasGuardaVidaForm.get('divulgacaoPhysicalAptitudeTestTime')?.value,
      startDocumentSubmissionTime:       this.datasGuardaVidaForm.get('startDocumentSubmissionTime')?.value,
      divulgacaoDocumentSubmissionTime:  this.datasGuardaVidaForm.get('divulgacaoDocumentSubmissionTime')?.value,
      startFinalResultsTime:             this.datasGuardaVidaForm.get('startFinalResultsTime')?.value,
      apresentacaoHorario:               this.datasGuardaVidaForm.get('apresentacaoHorario')?.value,
      divulgacaoInscritiondateHorario:  this.datasGuardaVidaForm.get('divulgacaoInscritiondateHorario')?.value,
      startInscritionHorario:           this.datasGuardaVidaForm.get('startInscritionHorario')?.value,
      endInscritionHorario:             this.datasGuardaVidaForm.get('endInscritionHorario')?.value,
      anoAtual: today.getFullYear().toString()

    };
    
    this.cursoService.setPropertyOnCursosByCursoEscolhidoID(propertiesGroup);
    this.cursoService.setDatasAbertura();
    this.cursoService.setDatasEspecificasCBC();
    this.isFormValid()
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

  isFormValid(): void {
    const formControls = this.datasGuardaVidaForm.controls;
    for (const controlName in formControls) {
      if (formControls.hasOwnProperty(controlName) && controlName !== 'anoAtual') {
        const control = formControls[controlName];
        if (control.invalid || control.value === null) {
          this.contentComponent.changeValidityByComponentName(AberturaDatasGuardaVidasCivilComponent, false);
          return;
        }
      }
    }
    this.contentComponent.changeValidityByComponentName(AberturaDatasGuardaVidasCivilComponent, true);
  }

}
