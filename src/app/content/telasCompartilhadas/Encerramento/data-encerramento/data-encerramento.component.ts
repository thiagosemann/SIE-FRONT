import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DocumentosCriadosService } from 'src/app/shared/service/documentosCriados_service';
import { EditalService } from 'src/app/shared/service/editais_service';
import { CursoService } from 'src/app/shared/service/objetosCursosService';
import { Curso } from 'src/app/shared/utilitarios/objetoCurso';

@Component({
  selector: 'app-data-encerramento',
  templateUrl: './data-encerramento.component.html',
  styleUrls: ['./data-encerramento.component.css']
})
export class DataEncerramentoComponent implements OnInit {
  datasForm: FormGroup;
  isTextareaDisabled: boolean = true;
  curso: Curso | undefined;
  iniCur:string ="";
  fimCur:string ="";
  finalidade:string ="";
  justificativaDataEncerramento:string ="";
  constructor(private formBuilder: FormBuilder,private cursoService: CursoService,private documentosCriadosService : DocumentosCriadosService, private editalService: EditalService) {
    this.datasForm = this.formBuilder.group({
      iniCur: [{ value: null, disabled: true }, Validators.required],
      fimCur: [{ value: null, disabled: true }, Validators.required],
      justificativaDataEncerramento: [{ value: null, disabled: true }]
    });
  }
  ngOnInit(): void {
    this.curso = this.cursoService.getCursoEscolhido();
    if(this.curso){
      if(this.curso.finalidade){
        this.finalidade = this.curso.finalidade
      }
      if(this.curso.iniCur){
        this.iniCur = this.curso.iniCur
      }
      if(this.curso.fimCur){
        this.fimCur = this.curso.fimCur
      }
      if(this.curso.justificativaDataEncerramento){
        this.justificativaDataEncerramento = this.curso.justificativaDataEncerramento
      }
      
    }
    if (this.iniCur === "" || this.fimCur === "" || this.finalidade === "") {
      this.rfcAtributes();
    } else {
      this.updateFormValues();
    }
  }
  toggleDisabled() {
    const iniCurControl = this.datasForm.get('iniCur');
    const fimCurControl = this.datasForm.get('fimCur');
    const justificativaControl = this.datasForm.get('justificativaDataEncerramento');

    if (iniCurControl && fimCurControl && justificativaControl) {
      if (iniCurControl.disabled && fimCurControl.disabled && justificativaControl.disabled) {
        iniCurControl.enable();
        fimCurControl.enable();
        justificativaControl.enable();
        this.isTextareaDisabled = false;
      } else {
        iniCurControl.disable();
        fimCurControl.disable();
        justificativaControl.disable();
        this.isTextareaDisabled = true;
      }
    }
  }

    rfcAtributes():void{
    if(this.curso && this.curso.numeroProcesso ){
      this.editalService.getEditaisByProcNum(this.curso.numeroProcesso).subscribe({
        next: (resp: any) => {
          if(resp[0]){
            this.documentosCriadosService.getCursoByAuth(resp[0].auth).subscribe({
              next: (resp: any) => {       
                this.finalidade = resp.dados.finalidade;
                this.iniCur = resp.dados.iniCur;
                this.fimCur = resp.dados.fimCur;
                this.enviarDados();
                this.updateFormValues();

              },
              error: (error: any) => {
                console.log('Erro ao buscar curso:', error);
              }
            });
          }

        },
        error: (error: any) => {
          console.log('Erro ao buscar curso:', error);
        }
      });
    }
  }

  enviarDados():void{   
    this.cursoService.setAttributeInCursoEscolhido('finalidade',this.finalidade)
    this.cursoService.setAttributeInCursoEscolhido('iniCur',this.iniCur)
    this.cursoService.setAttributeInCursoEscolhido('fimCur',this.fimCur)
    this.cursoService.setAttributeInCursoEscolhido('justificativaDataEncerramento',this.justificativaDataEncerramento)
    this.cursoService.setDatasAbertura()
  }

  updateFormValues(): void {
    this.datasForm.patchValue({
      iniCur: this.formatDate(this.iniCur),
      fimCur:  this.formatDate(this.fimCur),
      justificativa: this.justificativaDataEncerramento  // Você pode definir um valor padrão ou deixar como null
    });
  }

  formatDate(data: string): string {
    const parts = data.split('/');
    if (parts.length === 3) {
      // Montando a data no formato "yyyy-mm-dd"
      const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
      return formattedDate;
    } else {
      console.error('Formato de data inválido:', data);
      return '';
    }
  }
  
  
}
