import { Component, OnInit } from '@angular/core';
import { CursoService } from 'src/app/shared/service/objetosCursosService';
import { PdfService } from 'src/app/shared/service/documentosService/pdfService';
import { DocumentosCriadosService } from 'src/app/shared/service/documentosCriados_service';
import { Curso } from 'src/app/shared/utilitarios/objetoCurso';
import { CourseConfigService, ComponentItem } from '../../../../shared/service/CourseConfigService';
import { ContentComponent } from '../../../content.component';

interface ComponentError {
  component: string;
  propertyName: string;
  errorMessage: string;
  notEmpty:boolean;
}

@Component({
  selector: 'app-gerar-documentos',
  templateUrl: './gerar-documentos.component.html',
  styleUrls: ['./gerar-documentos.component.css']
})
export class GerarDocumentosComponent implements OnInit {
  hasPendingDocuments: boolean = false;
  cursoErrors: string[] = [];
  curso:Curso| undefined;
  public components: ComponentItem[] = [];
  constructor(
    private pdfService: PdfService,
    private cursoService: CursoService,
    private documentosCriadosService : DocumentosCriadosService,
    private courseConfigService: CourseConfigService,
    private contentComponent: ContentComponent,

  ) {}

  ngOnInit(): void {
    // Lógica para verificar as pendências do usuário
    this.curso = this.cursoService.getCursoEscolhido();

    this.hasPendingDocuments = this.checkPendingDocuments();

  }

  async downloadDocumentos(): Promise<void> {
    try {
      if (this.curso) {
        const auth = this.generateRandomHash(15);
        this.curso.auth = auth
        this.curso.linkInscrition = "http://localhost:4200/inscricoes/"+auth;
        const {  atividadeHomologada,globalProfessors, ...cursoEco } = this.curso;
        const type = this.curso.type;
        
        let objeto = {
          auth: "",
          dados: {},
          tipo: type,
          id_pge: this.curso.pge?.id // Aqui estamos obtendo o id_pge da propriedade pge do curso
        }
        if (type) {
          let pdfTypes: any[] = [];
          let pdfNames: any[] = [];
      
          if (type.includes("abertura")) {
              pdfTypes.push('edital');
              pdfTypes.push('plano');
      
              pdfNames.push('edital.pdf');
              pdfNames.push('plano.pdf');
      
          } else if (type.includes("encerramento")) {
              pdfTypes.push('rfc');
              pdfNames.push('rfc.pdf');
          } else if (type === 'parcial') {
              pdfTypes.push('');
              pdfNames.push('parcial.pdf');
          }
      
          if (pdfTypes.length > 0) {
              const pdfs: any[] = [];
              for (const pdfType of pdfTypes) {
                  const pdf = await this.pdfService.createDocument(cursoEco, type, pdfType);
                  pdfs.push(pdf);
              }
              const objeto = {
                  auth: auth,
                  dados: cursoEco,
                  tipo: type,
                  id_pge: this.curso.pge?.id
              };
      
              const { pge } = this.curso;
      
              this.documentosCriadosService.createCurso(objeto).subscribe(
                  (response) => {
                      console.log(objeto);
                      console.log('Curso criado com sucesso:', response);
                      pdfs.forEach((pdf, i) => {
                          this.downloadFile(pdf as Blob, pdfNames[i]);
                      });
      
                      this.contentComponent.courseTypePge();
                      this.cursoService.removeAllCurses();
                  },
                  (error) => {
                      console.error('Erro ao criar curso:', error);
                  }
              );
          }
      }
      

        

/*
        if(type){
          if(type.includes("abertura")){
            const editalPdf = await this.pdfService.createDocument(cursoEco, type,'edital');
            const planoPdf = await this.pdfService.createDocument(cursoEco, type,'plano');
            objeto = {
              auth: auth,
              dados: cursoEco,
              tipo: type,
              id_pge: this.curso.pge?.id // Aqui estamos obtendo o id_pge da propriedade pge do curso
            }
            const {pge} = this.curso;

            this.documentosCriadosService.createCurso(objeto).subscribe(
              (response) => {
                console.log(objeto)
                console.log('Curso criado com sucesso:', response);
                this.downloadFile(editalPdf as Blob, 'edital.pdf');
                this.downloadFile(planoPdf as Blob, 'plano.pdf');
                this.contentComponent.courseTypePge();
                this.cursoService.removeAllCurses();

              },
              (error) => {
                console.error('Erro ao criar curso:', error);
              }
            );
          }else if(type.includes("encerramento")){
            const rfcPdf = await this.pdfService.createDocument(cursoEco, type,'rfc');
            objeto = {
              auth: auth,
              dados: cursoEco,
              tipo: type,
              id_pge: this.curso.pge?.id // Aqui estamos obtendo o id_pge da propriedade pge do curso
            }
            const {pge} = this.curso;

            this.documentosCriadosService.createCurso(objeto).subscribe(
              (response) => {
                console.log(objeto)
                console.log('Curso criado com sucesso:', response);
                this.downloadFile(rfcPdf as Blob, 'rfc.pdf');
                this.contentComponent.courseTypePge();
                this.cursoService.removeAllCurses();
              },
              (error) => {
                console.error('Erro ao criar curso:', error);
              }
            );
          }else if(type=='parcial'){
            const rfcPdf = await this.pdfService.createDocument(cursoEco, type,'');
            objeto = {
              auth: auth,
              dados: cursoEco,
              tipo: type,
              id_pge: this.curso.pge?.id // Aqui estamos obtendo o id_pge da propriedade pge do curso
            }
            const {pge} = this.curso;

            this.documentosCriadosService.createCurso(objeto).subscribe(
              (response) => {
                console.log(objeto)
                console.log('Curso criado com sucesso:', response);
                this.downloadFile(rfcPdf as Blob, 'parcial.pdf');
                this.contentComponent.courseTypePge();
                this.cursoService.removeAllCurses();
              },
              (error) => {
                console.error('Erro ao criar curso:', error);
              }
            );
          }
        }
        */
      } else {
        console.error('Curso não selecionado.');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  }
  



  downloadFile(blob: Blob, filename: string): void {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  }



  checkPendingDocuments(): boolean {
    const curso = this.cursoService.getCursoEscolhido();
    console.log(curso)
    const errors = this.getCursoErrors(curso!);
    this.cursoErrors = errors
    if (errors.length > 0) {
      return true; // Indica que há pendências
    } else {
      return false; // Não há pendências
    }
  }
  getCursoErrors(curso: Curso): string[] {
    const errors: string[] = [];
    if (curso && curso.type) {
      this.components = this.courseConfigService.getComponents(curso.type);
      console.log(this.components);
      const componentErrorsMap: ComponentError[] = [];
      this.components.forEach(component => {
        const componentErrors = this.getComponentErrorsByComponentName(component.componentName);
        componentErrors.forEach(error => {
          componentErrorsMap.push(error);
        });
      });
          
      componentErrorsMap.forEach(({ component, propertyName, errorMessage, notEmpty }) => {
        if (notEmpty) {
          if (!curso[propertyName] || curso[propertyName].length === 0) {
            errors.push(`[${component}] ${errorMessage}`);
          }
        } else if (!curso[propertyName]) {
          errors.push(`[${component}] ${errorMessage}`);
        }
      });

    }

    return errors;
  }

  getComponentErrorsByComponentName(componentName: string): ComponentError[] {
    // Define os erros de cada componente de acordo com o nome do componente
    const componentErrors: { [key: string]: ComponentError[] } = {
       DatasAberturaMilitarComponent : [
        { component: "DatasAberturaMilitarComponent", propertyName: "startInscritiondate", errorMessage: "A data de início das inscrições não está definida.",notEmpty:false },
        { component: "DatasAberturaMilitarComponent", propertyName: "startInscritionHorario", errorMessage: "O horário de início das inscrições não está definido.",notEmpty:false },
        { component: "DatasAberturaMilitarComponent", propertyName: "endInscritiondate", errorMessage: "A data de término das inscrições não está definida.",notEmpty:false },
        { component: "DatasAberturaMilitarComponent", propertyName: "endInscritionHorario", errorMessage: "O horário de término das inscrições não está definido.",notEmpty:false },
        { component: "DatasAberturaMilitarComponent", propertyName: "emailInscrition", errorMessage: "O email de inscrição não está definido.",notEmpty:false },
        { component: "DatasAberturaMilitarComponent", propertyName: "iniCur", errorMessage: "O início do curso não está definido.",notEmpty:false },
        { component: "DatasAberturaMilitarComponent", propertyName: "fimCur", errorMessage: "O fim do curso não está definido.",notEmpty:false },
        { component: "DatasAberturaMilitarComponent", propertyName: "apresentacaoHorario", errorMessage: "O horário de apresentação não está definido.",notEmpty:false },
        { component: "DatasAberturaMilitarComponent", propertyName: "processoSeletivoDate", errorMessage: "A data do processo seletivo não está definida.",notEmpty:false },
        { component: "DatasAberturaMilitarComponent", propertyName: "processoSeletivoHorario", errorMessage: "O horário do processo seletivo não está definido.",notEmpty:false }
      ],
      DatasAberturaCivilComponent : [
        { component: "DatasAberturaCivilComponent", propertyName: "startInscritiondate", errorMessage: "A data de início das inscrições não está definida.",notEmpty:false },
        { component: "DatasAberturaCivilComponent", propertyName: "startInscritionHorario", errorMessage: "O horário de início das inscrições não está definido.",notEmpty:false },
        { component: "DatasAberturaCivilComponent", propertyName: "endInscritiondate", errorMessage: "A data de término das inscrições não está definida.",notEmpty:false },
        { component: "DatasAberturaCivilComponent", propertyName: "endInscritionHorario", errorMessage: "O horário de término das inscrições não está definido.",notEmpty:false },
        { component: "DatasAberturaCivilComponent", propertyName: "divulgacaoInscritiondate", errorMessage: "A data de divulgação da inscrição não está definida.",notEmpty:false },
        { component: "DatasAberturaCivilComponent", propertyName: "divulgacaoInscritiondateHorario", errorMessage: "O horário de divulgação da inscrição não está definida.",notEmpty:false },
        { component: "DatasAberturaCivilComponent", propertyName: "iniCur", errorMessage: "O início do curso não está definido.",notEmpty:false },
        { component: "DatasAberturaCivilComponent", propertyName: "fimCur", errorMessage: "O fim do curso não está definido.",notEmpty:false },
        { component: "DatasAberturaCivilComponent", propertyName: "apresentacaoHorario", errorMessage: "O horário de apresentação não está definido.",notEmpty:false },
        { component: "DatasAberturaCivilComponent", propertyName: "processoSeletivoDate", errorMessage: "A data do processo seletivo não está definida.",notEmpty:false },
        { component: "DatasAberturaCivilComponent", propertyName: "processoSeletivoHorario", errorMessage: "O horário do processo seletivo não está definido.",notEmpty:false }
      ],
      LocalApresentacaoComponent: [
        { component: "LocalApresentacaoComponent", propertyName: "localAtiBairro", errorMessage: "O bairro do local de atividades não está definido.",notEmpty:false },
        { component: "LocalApresentacaoComponent", propertyName: "localAtiRua", errorMessage: "A rua do local de atividades não está definida.",notEmpty:false },
        { component: "LocalApresentacaoComponent", propertyName: "localAtiNumeral", errorMessage: "O numeral do local de atividades não está definido.",notEmpty:false },
        { component: "LocalApresentacaoComponent", propertyName: "localAtiNome", errorMessage: "O nome do local de atividades não está definido.",notEmpty:false },
        { component: "LocalApresentacaoComponent", propertyName: "localAtiMunicipio", errorMessage: "O município do local de atividades não está definido.",notEmpty:false },
        { component: "LocalApresentacaoComponent", propertyName: "localApresentacao", errorMessage: "O local de apresentação não está definido.",notEmpty:false }
      ],
      PromotorAtividadeEnsinoComponent: [
        { component: "PromotorAtividadeEnsinoComponent", propertyName: "promoAtiBairro", errorMessage: "O bairro do promotor da atividade de ensino de atividades não está definido.",notEmpty:false },
        { component: "PromotorAtividadeEnsinoComponent", propertyName: "promoAtiRua", errorMessage: "A rua do promotor da atividade de ensino de atividades não está definida.",notEmpty:false },
        { component: "PromotorAtividadeEnsinoComponent", propertyName: "promoAtiNumeral", errorMessage: "O numeral do promotor da atividade de ensino de atividades não está definido.",notEmpty:false },
        { component: "PromotorAtividadeEnsinoComponent", propertyName: "promoAtiNome", errorMessage: "O nome do promotor da atividade de ensino de atividades não está definido.",notEmpty:false },
        { component: "PromotorAtividadeEnsinoComponent", propertyName: "promoAtiMunicipio", errorMessage: "O município do promotor da atividade de ensino de atividades não está definido.",notEmpty:false },
        { component: "PromotorAtividadeEnsinoComponent", propertyName: "promoApresentacao", errorMessage: "O nome do promotor da atividade de ensino não está definido.",notEmpty:false },
        { component: "PromotorAtividadeEnsinoComponent", propertyName: "promoAtiDescricao", errorMessage: "A descrição de dias e horários do promotor da atividade de ensino de apresentação não está definido.",notEmpty:false }

      ],
      CoordenadorComponent : [
        { component: "CoordenadorComponent", propertyName: "coordenador", errorMessage: "O coordenador não está definido.",notEmpty:false },
        { component: "CoordenadorComponent", propertyName: "coordenadorDescricao", errorMessage: "A descrição do coordenador não está definida.",notEmpty:false },
        { component: "CoordenadorComponent", propertyName: "coordenadorContato", errorMessage: "O contato do coordenador não está definido.",notEmpty:false }
      ],
      VagasCivilComponent : [
        { component: "VagasCivilComponent", propertyName: "municipio1Civil", errorMessage: "O municipio 1 não está definido.",notEmpty:false },
        { component: "VagasCivilComponent", propertyName: "municipio2Civil", errorMessage: "O municipio 2 não está definido.",notEmpty:false },
        { component: "VagasCivilComponent", propertyName: "municipio3Civil", errorMessage: "O municipio 3 não está definido.",notEmpty:false }
      ],
      LeitorQTComponent : [
        { component: "LeitorQTComponent", propertyName: "qtsFiles", errorMessage: "Insira pelo menos 1 arquivo de QTS.",notEmpty:false },
      ],
      NotasNumericaComponent : [
        { component: "NotasNumericaComponent", propertyName: "alunosFinalArray", errorMessage: "Insira pelo menos 1 aluno.",notEmpty:false },
      ],
      AberturaDatasCBCComponent : [
        { component: "AberturaDatasCBCComponent", propertyName: "startTheoreticalExamDate", errorMessage: "startTheoreticalExamDate.",notEmpty:false },
        { component: "AberturaDatasCBCComponent", propertyName: "startTheoreticalExamTime", errorMessage: "startTheoreticalExamTime.",notEmpty:false },
        { component: "AberturaDatasCBCComponent", propertyName: "divulgacaoTheoreticalExamDate", errorMessage: "divulgacaoTheoreticalExamDate.",notEmpty:false },
        { component: "AberturaDatasCBCComponent", propertyName: "divulgacaoTheoreticalExamTime", errorMessage: "divulgacaoTheoreticalExamTime.",notEmpty:false },
        { component: "AberturaDatasCBCComponent", propertyName: "startPhysicalAptitudeTestDate", errorMessage: "startPhysicalAptitudeTestDate",notEmpty:false },
        { component: "AberturaDatasCBCComponent", propertyName: "startPhysicalAptitudeTestTime", errorMessage: "startPhysicalAptitudeTestTime.",notEmpty:false },
        { component: "AberturaDatasCBCComponent", propertyName: "startInscritiondate", errorMessage: "startInscritiondate.",notEmpty:false },
        { component: "AberturaDatasCBCComponent", propertyName: "startInscritionHorario", errorMessage: "startInscritionHorario.",notEmpty:false },
        { component: "AberturaDatasCBCComponent", propertyName: "endInscritiondate", errorMessage: "endInscritiondate.",notEmpty:false },
        { component: "AberturaDatasCBCComponent", propertyName: "endInscritionHorario", errorMessage: "endInscritionHorario.",notEmpty:false },
        { component: "AberturaDatasCBCComponent", propertyName: "divulgacaoInscritiondate", errorMessage: "divulgacaoInscritiondate.",notEmpty:false },
        { component: "AberturaDatasCBCComponent", propertyName: "divulgacaoInscritiondateHorario", errorMessage: "divulgacaoInscritiondateHorario.",notEmpty:false },
        { component: "AberturaDatasCBCComponent", propertyName: "divulgacaoPhysicalAptitudeTestDate", errorMessage: "divulgacaoPhysicalAptitudeTestDate.",notEmpty:false },
        { component: "AberturaDatasCBCComponent", propertyName: "divulgacaoPhysicalAptitudeTestTime", errorMessage: "divulgacaoPhysicalAptitudeTestTime.",notEmpty:false },
        { component: "AberturaDatasCBCComponent", propertyName: "startDocumentSubmissionDate", errorMessage: "startDocumentSubmissionDate.",notEmpty:false },
        { component: "AberturaDatasCBCComponent", propertyName: "startDocumentSubmissionTime", errorMessage: "startDocumentSubmissionTime.",notEmpty:false },
        { component: "AberturaDatasCBCComponent", propertyName: "divulgacaoDocumentSubmissionDate", errorMessage: "divulgacaoDocumentSubmissionDate.",notEmpty:false },
        { component: "AberturaDatasCBCComponent", propertyName: "divulgacaoDocumentSubmissionTime", errorMessage: "divulgacaoDocumentSubmissionTime.",notEmpty:false },
        { component: "AberturaDatasCBCComponent", propertyName: "startFinalResultsDate", errorMessage: "startFinalResultsDate.",notEmpty:false },
        { component: "AberturaDatasCBCComponent", propertyName: "startFinalResultsTime", errorMessage: "startFinalResultsTime.",notEmpty:false },
        { component: "AberturaDatasCBCComponent", propertyName: "iniCur", errorMessage: "iniCur.",notEmpty:false },
        { component: "AberturaDatasCBCComponent", propertyName: "apresentacaoHorario", errorMessage: "apresentacaoHorario.",notEmpty:false },
        { component: "AberturaDatasCBCComponent", propertyName: "fimCur", errorMessage: "fimCur.",notEmpty:false },
        { component: "AberturaDatasCBCComponent", propertyName: "endCourseForecastDate", errorMessage: "endCourseForecastDate.",notEmpty:false },
        { component: "AberturaDatasCBCComponent", propertyName: "startOperationalTrainingDate", errorMessage: "startOperationalTrainingDate.",notEmpty:false },
        { component: "AberturaDatasCBCComponent", propertyName: "endOperationalTrainingDate", errorMessage: "endOperationalTrainingDate.",notEmpty:false },
        { component: "AberturaDatasCBCComponent", propertyName: "anoAtual", errorMessage: "anoAtual.",notEmpty:false }
      ],




      MeiosDivulgacaoComponent : [
        { component: "MeiosDivulgacaoComponent", propertyName: "redesSociais", errorMessage: "Insira pelo menos uma rede social.",notEmpty:false }
      ],
      DocentesComponent : [
        { component: "DocentesComponent", propertyName: "selectedProfessors", errorMessage: "Nenhum professor selecionado.",notEmpty:true },
      ],
       RequisitosComplementaresComponent :  [
        { component: "RequisitosComplementaresComponent", propertyName: "requisitoComplementar", errorMessage: "Requisitos complementares não definidos ou vazios.",notEmpty:true },
      ],
       PrescricoesComplementaresComponent :  [
        { component: "PrescricoesComplementaresComponent", propertyName: "prescricaoComplementar", errorMessage: "Prescrições complementares não definidas ou vazias.",notEmpty:true },
      ],
      Logistica1Component : [
        { component: "Logistica1Component", propertyName: "alimentos", errorMessage: "Alimentos não definidos ou vazios.",notEmpty:true },
        { component: "Logistica1Component", propertyName: "uniformes", errorMessage: "Uniformes não definidos ou vazios.",notEmpty:true },
        { component: "Logistica1Component", propertyName: "materiaisIndividuais", errorMessage: "Materiais individuais não definidos ou vazios.",notEmpty:true },
        { component: "Logistica1Component", propertyName: "materiaisColetivos", errorMessage: "Materiais coletivos não definidos ou vazios.",notEmpty:true }
      ],
      CronogramaTreinamentoComponent : [
        { component: "CronogramaTreinamentoComponent", propertyName: "licoes", errorMessage: "Sem lições definidas.",notEmpty:true },
      ]
    };
    return componentErrors[componentName] || [];
  }



  // Função para gerar número randômico de 15 caracteres
  generateRandomHash(length:number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomHash = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomHash += characters[randomIndex];
    }
    return randomHash;
  }


}

