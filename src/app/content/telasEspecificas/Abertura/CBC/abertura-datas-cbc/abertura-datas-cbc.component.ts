import { Component, OnInit,AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ContentComponent } from 'src/app/content/content.component';
import { AuthenticationService } from 'src/app/shared/service/authentication';
import { CursoService } from 'src/app/shared/service/objetosCursosService';
import { Curso } from 'src/app/shared/utilitarios/objetoCurso';
import { User } from 'src/app/shared/utilitarios/user';
import { debounceTime } from 'rxjs/operators';
import { takeUntil  } from 'rxjs/operators';
import { Subject  } from 'rxjs';


@Component({
  selector: 'app-abertura-datas-cbc',
  templateUrl: './abertura-datas-cbc.component.html',
  styleUrls: ['./abertura-datas-cbc.component.css']
})
export class AberturaDatasCBCComponent implements OnInit,AfterViewInit {
  datasCBCForm: FormGroup;
  private unsubscribe$ = new Subject<void>();

  datasMinProprieties = [
    'startInscritiondate',
    'endInscrition',
    'divulgacaoInscritiondate',
    'startTheoreticalExamDate',
    'divulgacaoTheoreticalExamDate',
    'startPhysicalAptitudeTestDate',
    'divulgacaoPhysicalAptitudeTestDate',
    'startDocumentSubmissionDate',
    'divulgacaoDocumentSubmissionDate',
    'startFinalResultsDate',
    'iniCur',
    'endCourseForecastDate',
    'startOperationalTrainingDate',
    'endOperationalTrainingDate'
  ];
  datasMin = [
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    ''
  ];
  user : User | undefined;
  cursoEscolhido : Curso | undefined;


  constructor(
    private formBuilder: FormBuilder,
    private cursoService: CursoService,
    private contentComponent : ContentComponent,
    private authenticationService : AuthenticationService,
    private toastr: ToastrService
  ) {
    this.datasCBCForm = this.formBuilder.group({
      startTheoreticalExamDate: null,
      startTheoreticalExamTime: null,
      divulgacaoTheoreticalExamDate: null,
      divulgacaoTheoreticalExamTime: null,
      startPhysicalAptitudeTestDate: null,
      startPhysicalAptitudeTestTime: null,
      startInscritiondate: null,
      startInscritionHorario:null,
      endInscritiondate:null,
      endInscritionHorario:null,
      emailInscrition:null,
      divulgacaoInscritiondate:null,
      divulgacaoInscritiondateHorario:null,
      divulgacaoPhysicalAptitudeTestDate: null,
      divulgacaoPhysicalAptitudeTestTime: null,
      startDocumentSubmissionDate: null,
      startDocumentSubmissionTime: null,
      divulgacaoDocumentSubmissionDate: null,
      divulgacaoDocumentSubmissionTime: null,
      startFinalResultsDate: null,
      startFinalResultsTime: null,
      iniCur: null,
      startCourseTime: null,
      fimCur: null,
      endCourseForecastDate: null,
      startOperationalTrainingDate: null,
      endOperationalTrainingDate: null,
      anoAtual: null
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
        startInscritiondate:            this.formatDateForSelect(this.cursoEscolhido.startInscritiondate??''),
        endInscritiondate:              this.formatDateForSelect(this.cursoEscolhido.endInscritiondate??''),
        emailInscrition:                this.cursoEscolhido.emailInscrition,
        divulgacaoInscritiondate:       this.formatDateForSelect(this.cursoEscolhido.divulgacaoInscritiondate??''),
        divulgacaoInscritiondateHorario:this.cursoEscolhido.divulgacaoInscritiondateHorario,
        startInscritionHorario:         this.cursoEscolhido.startInscritionHorario,
        endInscritionHorario:           this.cursoEscolhido.endInscritionHorario,
        startTheoreticalExamDate:       this.formatDateForSelect(this.cursoEscolhido.startTheoreticalExamDate??''),
        startTheoreticalExamTime:       this.formatDateForSelect(this.cursoEscolhido.startTheoreticalExamTime??''),
        divulgacaoTheoreticalExamDate:  this.formatDateForSelect(this.cursoEscolhido.divulgacaoTheoreticalExamDate??''),
        startPhysicalAptitudeTestDate:  this.formatDateForSelect(this.cursoEscolhido.startPhysicalAptitudeTestDate??''),
        divulgacaoPhysicalAptitudeTestDate:this.formatDateForSelect(this.cursoEscolhido.divulgacaoPhysicalAptitudeTestDate??''),
        startDocumentSubmissionDate:    this.formatDateForSelect(this.cursoEscolhido.startDocumentSubmissionDate??''),
        divulgacaoDocumentSubmissionDate:this.formatDateForSelect(this.cursoEscolhido.divulgacaoDocumentSubmissionDate??''),
        startFinalResultsDate:          this.formatDateForSelect(this.cursoEscolhido.startFinalResultsDate??''),
        iniCur:                         this.formatDateForSelect(this.cursoEscolhido.iniCur??''),
        fimCur:                         this.formatDateForSelect(this.cursoEscolhido.fimCur??''),
        endCourseForecastDate:          this.formatDateForSelect(this.cursoEscolhido.endCourseForecastDate??''),
        startOperationalTrainingDate:   this.formatDateForSelect(this.cursoEscolhido.startOperationalTrainingDate??''),
        endOperationalTrainingDate:     this.formatDateForSelect(this.cursoEscolhido.endOperationalTrainingDate??''),
        divulgacaoTheoreticalExamTime:  this.cursoEscolhido.divulgacaoTheoreticalExamTime,
        startPhysicalAptitudeTestTime:  this.cursoEscolhido.startPhysicalAptitudeTestTime,
        divulgacaoPhysicalAptitudeTestTime:this.cursoEscolhido.divulgacaoPhysicalAptitudeTestTime,
        startDocumentSubmissionTime:    this.cursoEscolhido.startDocumentSubmissionTime,
        divulgacaoDocumentSubmissionTime:this.cursoEscolhido.divulgacaoDocumentSubmissionTime,
        startFinalResultsTime:          this.cursoEscolhido.startFinalResultsTime,
        startCourseTime:                this.cursoEscolhido.startCourseTime
        };
        this.datasCBCForm.patchValue(propertiesGroup);
      }
      this.datasCBCForm.valueChanges
      .pipe(debounceTime(300))
      .subscribe(() => {
        this.enviarDados();
      });

    // Adicione os observadores aos controles relevantes
    const emailInscritionInput = document.getElementById('emailInscrition');
    if (emailInscritionInput) {
      emailInscritionInput.addEventListener('blur', (event) => {
        const value = (event.target as HTMLInputElement).value;
        this.chageEmailInscrtion(value);
      });
    }

    this.datasCBCForm.get('startInscritiondate')?.valueChanges.subscribe(value => {
     this.changeDates(0);
    });

    this.datasCBCForm.get('endInscrition')?.valueChanges.subscribe(value => {
      this.changeDates(1);
    });

    this.datasCBCForm.get('divulgacaoInscritiondate')?.valueChanges.subscribe(value => {
      this.changeDates(2);
    });

    this.datasCBCForm.get('startTheoreticalExamDate')?.valueChanges.subscribe(value => {
      this.changeDates(3);
    });

    this.datasCBCForm.get('divulgacaoTheoreticalExamDate')?.valueChanges.subscribe(value => {
      this.changeDates(4);
    });

    this.datasCBCForm.get('startPhysicalAptitudeTestDate')?.valueChanges.subscribe(value => {
      this.changeDates(5);
    });

    this.datasCBCForm.get('divulgacaoPhysicalAptitudeTestDate')?.valueChanges.subscribe(value => {
      this.changeDates(6);
    });

    this.datasCBCForm.get('startDocumentSubmissionDate')?.valueChanges.subscribe(value => {
      this.changeDates(7);
    });
    this.datasCBCForm.get('divulgacaoDocumentSubmissionDate')?.valueChanges.subscribe(value => {
      this.changeDates(8);
    });
    this.datasCBCForm.get('startFinalResultsDate')?.valueChanges.subscribe(value => {
      this.changeDates(9);
    });
    this.datasCBCForm.get('iniCur')?.valueChanges.subscribe(value => {
      this.changeDates(10);
    });
    this.datasCBCForm.get('endCourseForecastDate')?.valueChanges.subscribe(value => {
      this.changeDates(11);
    });
    this.datasCBCForm.get('startOperationalTrainingDate')?.valueChanges.subscribe(value => {
      this.changeDates(12);
    });
    this.datasCBCForm.get('endOperationalTrainingDate')?.valueChanges.subscribe(value => {
      this.changeDates(13);
    });


  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngAfterViewInit(){
    this.isFormValid()
  }

  enviarDados() {
    const today = new Date();
    const propertiesGroup = {
      startTheoreticalExamDate:         this.formatDateForPtBR(this.datasCBCForm.get('startTheoreticalExamDate')?.value),
      divulgacaoTheoreticalExamDate:    this.formatDateForPtBR(this.datasCBCForm.get('divulgacaoTheoreticalExamDate')?.value),
      startPhysicalAptitudeTestDate:    this.formatDateForPtBR(this.datasCBCForm.get('startPhysicalAptitudeTestDate')?.value),
      divulgacaoPhysicalAptitudeTestDate:this.formatDateForPtBR(this.datasCBCForm.get('divulgacaoPhysicalAptitudeTestDate')?.value),
      startDocumentSubmissionDate:      this.formatDateForPtBR(this.datasCBCForm.get('startDocumentSubmissionDate')?.value),
      divulgacaoDocumentSubmissionDate: this.formatDateForPtBR(this.datasCBCForm.get('divulgacaoDocumentSubmissionDate')?.value),
      startFinalResultsDate:            this.formatDateForPtBR(this.datasCBCForm.get('startFinalResultsDate')?.value),
      iniCur:                           this.formatDateForPtBR(this.datasCBCForm.get('iniCur')?.value),
      fimCur:                           this.formatDateForPtBR(this.datasCBCForm.get('fimCur')?.value),
      endCourseForecastDate:            this.formatDateForPtBR(this.datasCBCForm.get('endCourseForecastDate')?.value),
      startOperationalTrainingDate:     this.formatDateForPtBR(this.datasCBCForm.get('startOperationalTrainingDate')?.value),
      endOperationalTrainingDate:       this.formatDateForPtBR(this.datasCBCForm.get('endOperationalTrainingDate')?.value),
      startInscritiondate:              this.formatDateForPtBR(this.datasCBCForm.get('startInscritiondate')?.value),
      endInscritiondate:                this.formatDateForPtBR(this.datasCBCForm.get('endInscritiondate')?.value),
      divulgacaoInscritiondate:         this.formatDateForPtBR(this.datasCBCForm.get('divulgacaoInscritiondate')?.value),
      divulgacaoInscritiondateHorario:  this.datasCBCForm.get('divulgacaoInscritiondateHorario')?.value,
      startInscritionHorario:           this.datasCBCForm.get('startInscritionHorario')?.value,
      endInscritionHorario:             this.datasCBCForm.get('endInscritionHorario')?.value,
      emailInscrition:                  this.datasCBCForm.get('emailInscrition')?.value,
      startTheoreticalExamTime:         this.datasCBCForm.get('startTheoreticalExamTime')?.value,
      divulgacaoTheoreticalExamTime:    this.datasCBCForm.get('divulgacaoTheoreticalExamTime')?.value,
      startPhysicalAptitudeTestTime:    this.datasCBCForm.get('startPhysicalAptitudeTestTime')?.value,
      divulgacaoPhysicalAptitudeTestTime:this.datasCBCForm.get('divulgacaoPhysicalAptitudeTestTime')?.value,
      startDocumentSubmissionTime:      this.datasCBCForm.get('startDocumentSubmissionTime')?.value,
      divulgacaoDocumentSubmissionTime: this.datasCBCForm.get('divulgacaoDocumentSubmissionTime')?.value,
      startFinalResultsTime:            this.datasCBCForm.get('startFinalResultsTime')?.value,
      startCourseTime:                  this.datasCBCForm.get('startCourseTime')?.value,
      anoAtual: today.getFullYear().toString()

    };
    
    this.cursoService.setPropertyOnCursosByCursoEscolhidoID(propertiesGroup);
    //this.cursoService.setDatasAbertura()
    this.isFormValid()
  }
  
  isFormValid(): void {
    const formControls = this.datasCBCForm.controls;
    for (const controlName in formControls) {
      if (formControls.hasOwnProperty(controlName) && controlName !== 'anoAtual') {
        const control = formControls[controlName];
        if (control.invalid || control.value === null) {
          this.contentComponent.changeValidityByComponentName(AberturaDatasCBCComponent, false);
          return;
        }
      }
    }
    this.contentComponent.changeValidityByComponentName(AberturaDatasCBCComponent, true);
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

  shouldApplyDateFilter(): boolean {
    if(!this.user?.dateFilter){
      return true
    }else{
      return false
    }
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

  chageEmailInscrtion(email: string) {
    const validDomain = "@cbm.sc.gov.br";
    if (!email.endsWith(validDomain) && email!=="") {
      this.toastr.error("Insira um e-mail válido @cbm.sc.gov.br");
  
      this.datasCBCForm.patchValue({
        emailInscrition: undefined,
      });
    }
  
    this.datasCBCForm.updateValueAndValidity();
  }

  changeDates(id: number) {
    if (this.shouldApplyDateFilter()) {
      const minDate = new Date(this.datasCBCForm.get(this.datasMinProprieties[id])?.value);
      minDate.setDate(minDate.getDate() + 2);

      // Desinscrever os observáveis antes de chamar setValue('')
      this.unsubscribe$.next();

      for (let i = id; i < this.datasMin.length; i++) {
        console.log(this.formatDate(minDate));
        this.datasMin[i] = this.formatDate(minDate);
        if(i!=id){
          this.datasCBCForm.get(this.datasMinProprieties[i])?.setValue('', { emitEvent: false });
        }
      }

      // Reinscrever os observáveis após a alteração
      this.subscribeToValueChanges();
    }
  }

  private subscribeToValueChanges() {
    this.datasCBCForm.get('startInscritiondate')?.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(value => {
        this.changeDates(0);
      });
  }
  
  

}
