import { Component, OnInit,AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ContentComponent } from 'src/app/content/content.component';
import { AuthenticationService } from 'src/app/shared/service/authentication';
import { CursoService } from 'src/app/shared/service/objetosCursosService';
import { Curso } from 'src/app/shared/utilitarios/objetoCurso';
import { User } from 'src/app/shared/utilitarios/user';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-abertura-datas-cbc',
  templateUrl: './abertura-datas-cbc.component.html',
  styleUrls: ['./abertura-datas-cbc.component.css']
})
export class AberturaDatasCBCComponent implements OnInit,AfterViewInit {
  datasCBCForm: FormGroup;
  startTheoreticalExamDate: string;
  divulgacaoTheoreticalExamDate: string;
  startPhysicalAptitudeTestDate: string;
  divulgacaoPhysicalAptitudeTestDate: string;
  startDocumentSubmissionDate: string;
  divulgacaoDocumentSubmissionDate: string;
  startFinalResultsDate: string;
  iniCur: string;
  endCourseSemesterDate: string;
  fimCur: string;
  endCourseForecastDate: string;
  endCourseForecastEndDate: string;
  startOperationalTrainingDate: string;
  endOperationalTrainingDate: string;
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
      endCourseSemesterDate: null,
      fimCur: null,
      endCourseForecastDate: null,
      endCourseForecastEndDate: null,
      startOperationalTrainingDate: null,
      endOperationalTrainingDate: null,
      anoAtual: null
    });
    this.startTheoreticalExamDate= this.setMinDate();
    this.divulgacaoTheoreticalExamDate= this.setMinDate();
    this.startPhysicalAptitudeTestDate= this.setMinDate();
    this.divulgacaoPhysicalAptitudeTestDate= this.setMinDate();
    this.startDocumentSubmissionDate= this.setMinDate();
    this.divulgacaoDocumentSubmissionDate= this.setMinDate();
    this.startFinalResultsDate= this.setMinDate();
    this.iniCur= this.setMinDate();
    this.endCourseSemesterDate= this.setMinDate();
    this.fimCur= this.setMinDate();
    this.endCourseForecastDate= this.setMinDate();
    this.endCourseForecastEndDate= this.setMinDate();
    this.startOperationalTrainingDate= this.setMinDate();
    this.endOperationalTrainingDate= this.setMinDate();
  }

    ngOnInit() {
      this.cursoEscolhido = this.cursoService.getCursoEscolhido();
      this.user = this.authenticationService.getUser()!;
      console.log("Entrou")
     
      if (this.cursoEscolhido) {
        const propertiesGroup = {
        startTheoreticalExamDate:       this.formatDateForSelect(this.cursoEscolhido.startTheoreticalExamDate??''),
        startTheoreticalExamTime:       this.formatDateForSelect(this.cursoEscolhido.startTheoreticalExamTime??''),
        divulgacaoTheoreticalExamDate:         this.formatDateForSelect(this.cursoEscolhido.divulgacaoTheoreticalExamDate??''),
        startPhysicalAptitudeTestDate:  this.formatDateForSelect(this.cursoEscolhido.startPhysicalAptitudeTestDate??''),
        divulgacaoPhysicalAptitudeTestDate:    this.formatDateForSelect(this.cursoEscolhido.divulgacaoPhysicalAptitudeTestDate??''),
        startDocumentSubmissionDate:    this.formatDateForSelect(this.cursoEscolhido.startDocumentSubmissionDate??''),
        divulgacaoDocumentSubmissionDate:      this.formatDateForSelect(this.cursoEscolhido.divulgacaoDocumentSubmissionDate??''),
        startFinalResultsDate:          this.formatDateForSelect(this.cursoEscolhido.startFinalResultsDate??''),
        endCourseSemesterDate:          this.formatDateForSelect(this.cursoEscolhido.endCourseSemesterDate??''),
        iniCur:                         this.formatDateForSelect(this.cursoEscolhido.iniCur??''),
        fimCur:                         this.formatDateForSelect(this.cursoEscolhido.fimCur??''),
        endCourseForecastDate:          this.formatDateForSelect(this.cursoEscolhido.endCourseForecastDate??''),
        endCourseForecastEndDate:       this.formatDateForSelect(this.cursoEscolhido.endCourseForecastEndDate??''),
        startOperationalTrainingDate:   this.formatDateForSelect(this.cursoEscolhido.startOperationalTrainingDate??''),
        endOperationalTrainingDate:     this.formatDateForSelect(this.cursoEscolhido.endOperationalTrainingDate??''),
        divulgacaoTheoreticalExamTime:         this.cursoEscolhido.divulgacaoTheoreticalExamTime,
        startPhysicalAptitudeTestTime:  this.cursoEscolhido.startPhysicalAptitudeTestTime,
        divulgacaoPhysicalAptitudeTestTime:    this.cursoEscolhido.divulgacaoPhysicalAptitudeTestTime,
        startDocumentSubmissionTime:    this.cursoEscolhido.startDocumentSubmissionTime,
        divulgacaoDocumentSubmissionTime:      this.cursoEscolhido.divulgacaoDocumentSubmissionTime,
        startFinalResultsTime:          this.cursoEscolhido.startFinalResultsTime,
        startCourseTime:                this.cursoEscolhido.startCourseTime
        };
        console.log(propertiesGroup)
        this.datasCBCForm.patchValue(propertiesGroup);
      }
      this.datasCBCForm.valueChanges
      .pipe(debounceTime(300))
      .subscribe(() => {
        console.log('Form values changed');
        this.enviarDados();
      });
    

  }

  ngAfterViewInit(){
    this.isFormValid()
  }

  enviarDados() {
    const today = new Date();
    const propertiesGroup = {
      startTheoreticalExamDate:         this.formatDateForPtBR(this.datasCBCForm.get('startTheoreticalExamDate')?.value),
      divulgacaoTheoreticalExamDate:           this.formatDateForPtBR(this.datasCBCForm.get('divulgacaoTheoreticalExamDate')?.value),
      startPhysicalAptitudeTestDate:    this.formatDateForPtBR(this.datasCBCForm.get('startPhysicalAptitudeTestDate')?.value),
      divulgacaoPhysicalAptitudeTestDate:      this.formatDateForPtBR(this.datasCBCForm.get('divulgacaoPhysicalAptitudeTestDate')?.value),
      startDocumentSubmissionDate:      this.formatDateForPtBR(this.datasCBCForm.get('startDocumentSubmissionDate')?.value),
      divulgacaoDocumentSubmissionDate:        this.formatDateForPtBR(this.datasCBCForm.get('divulgacaoDocumentSubmissionDate')?.value),
      startFinalResultsDate:            this.formatDateForPtBR(this.datasCBCForm.get('startFinalResultsDate')?.value),
      iniCur:                           this.formatDateForPtBR(this.datasCBCForm.get('iniCur')?.value),
      endCourseSemesterDate:            this.formatDateForPtBR(this.datasCBCForm.get('endCourseSemesterDate')?.value),
      fimCur:                           this.formatDateForPtBR(this.datasCBCForm.get('fimCur')?.value),
      endCourseForecastDate:            this.formatDateForPtBR(this.datasCBCForm.get('endCourseForecastDate')?.value),
      endCourseForecastEndDate:         this.formatDateForPtBR(this.datasCBCForm.get('endCourseForecastEndDate')?.value),
      startOperationalTrainingDate:     this.formatDateForPtBR(this.datasCBCForm.get('startOperationalTrainingDate')?.value),
      endOperationalTrainingDate:       this.formatDateForPtBR(this.datasCBCForm.get('endOperationalTrainingDate')?.value),
      startTheoreticalExamTime:         this.datasCBCForm.get('startTheoreticalExamTime')?.value,
      divulgacaoTheoreticalExamTime:           this.datasCBCForm.get('divulgacaoTheoreticalExamTime')?.value,
      startPhysicalAptitudeTestTime:    this.datasCBCForm.get('startPhysicalAptitudeTestTime')?.value,
      divulgacaoPhysicalAptitudeTestTime:      this.datasCBCForm.get('divulgacaoPhysicalAptitudeTestTime')?.value,
      startDocumentSubmissionTime:      this.datasCBCForm.get('startDocumentSubmissionTime')?.value,
      divulgacaoDocumentSubmissionTime:        this.datasCBCForm.get('divulgacaoDocumentSubmissionTime')?.value,
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

}
