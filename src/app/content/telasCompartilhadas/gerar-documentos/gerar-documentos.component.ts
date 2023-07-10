import { Component, OnInit } from '@angular/core';
import { CursoService } from 'src/app/shared/service/objetosCursosService';
import { PdfService } from 'src/app/shared/service/documentosService/pdfService';
import { Curso } from 'src/app/shared/utilitarios/objetoCurso';

@Component({
  selector: 'app-gerar-documentos',
  templateUrl: './gerar-documentos.component.html',
  styleUrls: ['./gerar-documentos.component.css']
})
export class GerarDocumentosComponent implements OnInit {
  hasPendingDocuments: boolean = false;

  constructor(
    private pdfService: PdfService,
    private cursoService: CursoService
  ) {}

  ngOnInit(): void {
    // Lógica para verificar as pendências do usuário
    this.hasPendingDocuments = this.checkPendingDocuments();
  }

  async downloadDocumentos(): Promise<void> {
    try {
      const curso = this.cursoService.getCursoEscolhido();
      if (curso) {
        const pdfBlob = await this.pdfService.generatePdf(curso);
        this.downloadFile(pdfBlob, 'edital.pdf');
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

  async generatePlanoEnsinoPdf(): Promise<Blob> {
    // Lógica para gerar o PDF do Plano de Ensino
    // Retorne o Blob do PDF gerado
    // Exemplo:
    const pdfContent = 'PDF do Plano de Ensino'; // Conteúdo do PDF do Plano de Ensino
    const pdfBlob = new Blob([pdfContent], { type: 'application/pdf' });
    return pdfBlob;
  }

  checkPendingDocuments(): boolean {
    // Lógica para verificar as pendências do usuário
    // Retorne true se houver pendências, ou false caso contrário
    // Exemplo:
    return false; // Indica que há pendências
  }
}
