import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CursoService } from 'src/app/shared/service/objetosCursosService';
import { PdfService } from 'src/app/shared/service/documentosService/pdfServiceAbertura';
import { Curso } from 'src/app/shared/utilitarios/objetoCurso';
import { DocumentosCriadosService } from 'src/app/shared/service/documentosCriados_service';

@Component({
  selector: 'app-preview-doc',
  templateUrl: './preview-doc.component.html',
  styleUrls: ['./preview-doc.component.css']
})
export class PreviewDocComponent implements OnInit {
  pdfUrl: SafeResourceUrl | undefined;
  curso: Curso | undefined;
  constructor(private pdfService: PdfService, private sanitizer: DomSanitizer,private cursoService: CursoService, private documentosCriadosService : DocumentosCriadosService ) { }

  ngOnInit(): void {
    this.curso = this.cursoService.getCursoEscolhido();
    this.generatePdf();
  }

  async generatePdf(): Promise<void> {
    if (this.curso) {
      const pdfBlob = await this.pdfService.createDocument(this.curso, this.curso.type!,'edital');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(pdfUrl);
      this.documentosCriadosService.createCurso(this.curso)
    }
  }
  
}