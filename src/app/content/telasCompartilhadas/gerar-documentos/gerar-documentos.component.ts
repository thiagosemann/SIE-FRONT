import { Component, OnInit } from '@angular/core';
import { CursoService } from 'src/app/shared/service/objetosCursosService';
import { PdfService } from 'src/app/shared/service/documentosService/pdfService';
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
        // Gerar o número randômico de 15 caracteres
        const auth = this.generateRandomHash(15);
        curso.auth = auth
        // Remover a propriedade "pge" e "atividadeHomologada" do curso antes de enviar
        const { pge, atividadeHomologada,globalProfessors, ...cursoEco } = curso;
        const type = curso.type;
        let objeto = {
          auth: "",
          dados: {},
          tipo: "abertura",
          id_pge: curso.pge?.id // Aqui estamos obtendo o id_pge da propriedade pge do curso
        }
        console.log(type)
        if(type){
          if(type.includes("abertura")){
            const editalPdf = await this.pdfService.createDocument(cursoEco, 'edital', type);
            const planoPdf = await this.pdfService.createDocument(cursoEco, 'plano', type);
            objeto = {
              auth: auth,
              dados: cursoEco,
              tipo: "abertura",
              id_pge: curso.pge?.id // Aqui estamos obtendo o id_pge da propriedade pge do curso
            }
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
            const relatorioFinalPdf = await this.pdfService.createDocument(cursoEco, 'relatorioFinal', type);
            objeto = {
              auth: auth,
              dados: cursoEco,
              tipo: "encerramento",
              id_pge: curso.pge?.id // Aqui estamos obtendo o id_pge da propriedade pge do curso
            }
            this.generateCursosService.createCurso(objeto).subscribe(
              (response) => {
                console.log('Curso criado com sucesso:', response);
                this.downloadFile(relatorioFinalPdf as Blob, 'relatorioFinalPdf.pdf');
              },
              (error) => {
                console.error('Erro ao criar curso:', error);
              }
            );
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
       DatasAberturaComponent : [
        { component: "DatasAberturaComponent", propertyName: "startInscritiondate", errorMessage: "A data de início das inscrições não está definida.",notEmpty:false },
        { component: "DatasAberturaComponent", propertyName: "startInscritionHorario", errorMessage: "O horário de início das inscrições não está definido.",notEmpty:false },
        { component: "DatasAberturaComponent", propertyName: "endInscritiondate", errorMessage: "A data de término das inscrições não está definida.",notEmpty:false },
        { component: "DatasAberturaComponent", propertyName: "endInscritionHorario", errorMessage: "O horário de término das inscrições não está definido.",notEmpty:false },
        { component: "DatasAberturaComponent", propertyName: "emailInscrition", errorMessage: "O email de inscrição não está definido.",notEmpty:false },
        { component: "DatasAberturaComponent", propertyName: "iniCur", errorMessage: "O início do curso não está definido.",notEmpty:false },
        { component: "DatasAberturaComponent", propertyName: "fimCur", errorMessage: "O fim do curso não está definido.",notEmpty:false },
        { component: "DatasAberturaComponent", propertyName: "apresentacaoHorario", errorMessage: "O horário de apresentação não está definido.",notEmpty:false },
        { component: "DatasAberturaComponent", propertyName: "processoSeletivoDate", errorMessage: "A data do processo seletivo não está definida.",notEmpty:false },
        { component: "DatasAberturaComponent", propertyName: "processoSeletivoHorario", errorMessage: "O horário do processo seletivo não está definido.",notEmpty:false }
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

