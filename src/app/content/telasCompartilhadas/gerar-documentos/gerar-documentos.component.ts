import { Component, OnInit } from '@angular/core';
import { CursoService } from 'src/app/shared/service/objetosCursosService';
import { PdfService } from 'src/app/shared/service/documentosService/pdfService';
import { GenerateCursosService } from 'src/app/shared/service/genereteCurosService';
import { Curso } from 'src/app/shared/utilitarios/objetoCurso';

@Component({
  selector: 'app-gerar-documentos',
  templateUrl: './gerar-documentos.component.html',
  styleUrls: ['./gerar-documentos.component.css']
})
export class GerarDocumentosComponent implements OnInit {
  hasPendingDocuments: boolean = false;
  cursoErrors: string[] = [];

  constructor(
    private pdfService: PdfService,
    private cursoService: CursoService,
    private generateCursosService : GenerateCursosService
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
   
        
        const editalPdf = await this.pdfService.createDocument(cursoEco, 'edital', 'Capacitacao');
        this.downloadFile(editalPdf as Blob, 'edital.pdf');
        const planoPdf = await this.pdfService.createDocument(cursoEco, 'plano', 'Capacitacao');
        this.downloadFile(planoPdf as Blob, 'plano.pdf');
  

        // Enviar apenas o id da propriedade "pge" em "id_pge"
        const objeto = {
          auth: auth,
          dados: cursoEco,
          tipo: "abertura",
          id_pge: curso.pge?.id // Aqui estamos obtendo o id_pge da propriedade pge do curso
        }
  
        this.generateCursosService.createCurso(objeto).subscribe(
          (response) => {
            console.log('Curso criado com sucesso:', response);
          },
          (error) => {
            console.error('Erro ao criar curso:', error);
          }
        );
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
    const errors = this.getCursoErrors(curso!);
    this.cursoErrors = errors
    if (errors.length > 0) {
      console.log("Erros encontrados:", errors);
      return true; // Indica que há pendências
    } else {
      return false; // Não há pendências
    }
  }

   getCursoErrors(curso: Curso): string[] {
    const errors: string[] = [];

    if (!curso.startInscritiondate) {
      errors.push("A data de início das inscrições não está definida.");
    }
  
    if (!curso.startInscritionHorario) {
      errors.push("O horário de início das inscrições não está definido.");
    }
  
    if (!curso.endInscritiondate) {
      errors.push("A data de término das inscrições não está definida.");
    }
  
    if (!curso.endInscritionHorario) {
      errors.push("O horário de término das inscrições não está definido.");
    }
  
    if (!curso.emailInscrition) {
      errors.push("O email de inscrição não está definido.");
    }
  
    if (!curso.iniCur) {
      errors.push("O início do curso não está definido.");
    }
  
    if (!curso.fimCur) {
      errors.push("O fim do curso não está definido.");
    }
  
    if (!curso.apresentacaoHorario) {
      errors.push("O horário de apresentação não está definido.");
    }
  
    if (!curso.processoSeletivoDate) {
      errors.push("A data do processo seletivo não está definida.");
    }
  
    if (!curso.processoSeletivoHorario) {
      errors.push("O horário do processo seletivo não está definido.");
    }
  
    if (!curso.localAtiBairro) {
      errors.push("O bairro do local de atividades não está definido.");
    }
  
    if (!curso.localAtiRua) {
      errors.push("A rua do local de atividades não está definida.");
    }
  
    if (!curso.localAtiNumeral) {
      errors.push("O numeral do local de atividades não está definido.");
    }
  
    if (!curso.localAtiNome) {
      errors.push("O nome do local de atividades não está definido.");
    }
  
    if (!curso.localAtiMunicipio) {
      errors.push("O município do local de atividades não está definido.");
    }
  
    if (!curso.coordenador) {
      errors.push("O coordenador não está definido.");
    }
  
    if (!curso.coordenadorDescricao) {
      errors.push("A descrição do coordenador não está definida.");
    }
  
    if (!curso.coordenadorContato) {
      errors.push("O contato do coordenador não está definido.");
    }
  
    if (!curso.selectedProfessors || curso.selectedProfessors.length === 0) {
      errors.push("Nenhum professor selecionado.");
    }
  
    if (!curso.requisitoComplementar || curso.requisitoComplementar.length === 0) {
      errors.push("Requisitos complementares não definidos ou vazios.");
    }
     
    if (!curso.prescricaoComplementar || curso.prescricaoComplementar.length === 0) {
      errors.push("Prescrições complementares não definidas ou vazias.");
    }
  
    if (!curso.alimentos || curso.alimentos.length === 0) {
      errors.push("Alimentos não definidos ou vazios.");
    }
  
    if (!curso.uniformes || curso.uniformes.length === 0) {
      errors.push("Uniformes não definidos ou vazios.");
    }
  
    if (!curso.materiaisIndividuais || curso.materiaisIndividuais.length === 0) {
      errors.push("Materiais individuais não definidos ou vazios.");
    }
  
    if (!curso.materiaisColetivos || curso.materiaisColetivos.length === 0) {
      errors.push("Materiais coletivos não definidos ou vazios.");
    }

    if (!curso.localApresentacao) {
      errors.push("O local de apresentação não está definido.");
    }    
    return errors;
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

