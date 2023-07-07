import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CursoService } from 'src/app/shared/service/objetosCursosService';
import { PdfService } from 'src/app/shared/service/documentosService/pdfService';
import { Curso } from 'src/app/shared/utilitarios/objetoCurso';

@Component({
  selector: 'app-preview-doc',
  templateUrl: './preview-doc.component.html',
  styleUrls: ['./preview-doc.component.css']
})
export class PreviewDocComponent implements OnInit {
  pdfUrl: SafeResourceUrl | undefined;

  constructor(private pdfService: PdfService, private sanitizer: DomSanitizer,private cursoService: CursoService) { }

  ngOnInit(): void {
    this.generatePdf();
  }

  async generatePdf(): Promise<void> {
    try {
      const curso = this.cursoService.getCursoEscolhido();
      //const cursoTest : Curso = {id:1};
      if (curso) {
        const pdfBlob = await this.pdfService.generatePdf(curso);
        const pdfUrl = URL.createObjectURL(pdfBlob);
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(pdfUrl);
      } else {
        console.error('Curso não selecionado.');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  }
  
}
