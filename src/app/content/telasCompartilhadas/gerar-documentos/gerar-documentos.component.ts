import { Component, OnInit } from '@angular/core';
import { CursoService } from 'src/app/shared/service/objetosCursosService';
import { PdfService } from 'src/app/shared/service/documentosService/pdfServiceAbertura';
import { GenerateCursosService } from 'src/app/shared/service/genereteCurosService';
import { Curso } from 'src/app/shared/utilitarios/objetoCurso';
import { CourseConfigService, ComponentItem } from '../../../shared/service/CourseConfigService';

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
  public components: ComponentItem[] = [];
  constructor(
    private pdfService: PdfService,
    private cursoService: CursoService,
    private generateCursosService : GenerateCursosService,
    private courseConfigService: CourseConfigService

  ) {}

  ngOnInit(): void {
    // Lógica para verificar as pendências do usuário
    this.hasPendingDocuments = this.checkPendingDocuments();

  }

  async downloadDocumentos(): Promise<void> {
    try {
      const curso = this.cursoService.getCursoEscolhido();
      if (curso) {
        const auth = this.generateRandomHash(15);
        curso.auth = auth
        const {  atividadeHomologada,globalProfessors, ...cursoEco } = curso;
        const type = curso.type;
        let objeto = {
          auth: "",
          dados: {},
          tipo: type,
          id_pge: curso.pge?.id // Aqui estamos obtendo o id_pge da propriedade pge do curso
        }
        if(type){
          if(type.includes("abertura")){
            const editalPdf = await this.pdfService.createDocument(cursoEco, type,'edital');
            const planoPdf = await this.pdfService.createDocument(cursoEco, type,'plano');
            objeto = {
              auth: auth,
              dados: cursoEco,
              tipo: type,
              id_pge: curso.pge?.id // Aqui estamos obtendo o id_pge da propriedade pge do curso
            }
            const {pge} = curso;

            this.generateCursosService.createCurso(objeto).subscribe(
              (response) => {
                console.log('Curso criado com sucesso:', response);
                this.downloadFile(editalPdf as Blob, 'edital.pdf');
                this.downloadFile(planoPdf as Blob, 'plano.pdf');
              },
              (error) => {
                console.error('Erro ao criar curso:', error);
              }
            );
          }else if(type.includes("encerramento")){
  
          }
        }
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
        { component: "DatasAberturaCivilComponent", propertyName: "linkInscrition", errorMessage: "O link de inscrição não está definido.",notEmpty:false },
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
      CoordenadorComponent : [
        { component: "CoordenadorComponent", propertyName: "coordenador", errorMessage: "O coordenador não está definido.",notEmpty:false },
        { component: "CoordenadorComponent", propertyName: "coordenadorDescricao", errorMessage: "A descrição do coordenador não está definida.",notEmpty:false },
        { component: "CoordenadorComponent", propertyName: "coordenadorContato", errorMessage: "O contato do coordenador não está definido.",notEmpty:false }
      ],
      VagasCivilComponent : [
        { component: "VagasCivilComponent", propertyName: "vagasCivilMunicipio1", errorMessage: "O municipio 1 não está definido.",notEmpty:false },
        { component: "VagasCivilComponent", propertyName: "vagasCivilMunicipio2", errorMessage: "O municipio 2 não está definido.",notEmpty:false },
        { component: "VagasCivilComponent", propertyName: "vagasCivilMunicipio3", errorMessage: "O municipio 3 não está definido.",notEmpty:false }
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

