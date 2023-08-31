import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ContentComponent } from 'src/app/content/content.component';
import { AuthenticationService } from 'src/app/shared/service/authentication';
import { CursoService } from 'src/app/shared/service/objetosCursosService';
import { Curso } from 'src/app/shared/utilitarios/objetoCurso';
import { User } from 'src/app/shared/utilitarios/user';

@Component({
  selector: 'app-abertura-datas-cbc',
  templateUrl: './abertura-datas-cbc.component.html',
  styleUrls: ['./abertura-datas-cbc.component.css']
})
export class AberturaDatasCBCComponent {
  datasForm: FormGroup;
  startTheoreticalExamDate: string;
  endTheoreticalExamDate: string;
  startPhysicalAptitudeTestDate: string;
  endPhysicalAptitudeTestDate: string;
  startDocumentSubmissionDate: string;
  endDocumentSubmissionDate: string;
  startFinalResultsDate: string;
  startCourseDate: string;
  endCourseSemesterDate: string;
  endCourseSemesterEndDate: string;
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
    this.datasForm = this.formBuilder.group({
      startTheoreticalExamDate: null,
      startTheoreticalExamTime: null,
      endTheoreticalExamDate: null,
      endTheoreticalExamTime: null,
      startPhysicalAptitudeTestDate: null,
      startPhysicalAptitudeTestTime: null,
      endPhysicalAptitudeTestDate: null,
      endPhysicalAptitudeTestTime: null,
      startDocumentSubmissionDate: null,
      startDocumentSubmissionTime: null,
      endDocumentSubmissionDate: null,
      endDocumentSubmissionTime: null,
      startFinalResultsDate: null,
      startFinalResultsTime: null,
      startCourseDate: null,
      startCourseTime: null,
      endCourseSemesterDate: null,
      endCourseSemesterEndDate: null,
      endCourseForecastDate: null,
      endCourseForecastEndDate: null,
      startOperationalTrainingDate: null,
      endOperationalTrainingDate: null
    });
    this.startTheoreticalExamDate= this.setMinDate();
    this.endTheoreticalExamDate= this.setMinDate();
    this.startPhysicalAptitudeTestDate= this.setMinDate();
    this.endPhysicalAptitudeTestDate= this.setMinDate();
    this.startDocumentSubmissionDate= this.setMinDate();
    this.endDocumentSubmissionDate= this.setMinDate();
    this.startFinalResultsDate= this.setMinDate();
    this.startCourseDate= this.setMinDate();
    this.endCourseSemesterDate= this.setMinDate();
    this.endCourseSemesterEndDate= this.setMinDate();
    this.endCourseForecastDate= this.setMinDate();
    this.endCourseForecastEndDate= this.setMinDate();
    this.startOperationalTrainingDate= this.setMinDate();
    this.endOperationalTrainingDate= this.setMinDate();
  }

  ngOnInit() {
    this.cursoEscolhido = this.cursoService.getCursoEscolhido();
    this.user = this.authenticationService.getUser()!;

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

}
