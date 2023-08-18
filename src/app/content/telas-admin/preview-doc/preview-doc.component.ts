import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CursoService } from 'src/app/shared/service/objetosCursosService';
import { PdfService } from 'src/app/shared/service/documentosService/pdfService';
import { Curso } from 'src/app/shared/utilitarios/objetoCurso';
import { GenerateCursosService } from 'src/app/shared/service/genereteCurosService';

@Component({
  selector: 'app-preview-doc',
  templateUrl: './preview-doc.component.html',
  styleUrls: ['./preview-doc.component.css']
})
export class PreviewDocComponent implements OnInit {
  pdfUrl: SafeResourceUrl | undefined;
  curso: Curso | undefined;
  constructor(private pdfService: PdfService, private sanitizer: DomSanitizer,private cursoService: CursoService, private generateCursosService : GenerateCursosService ) { }

  ngOnInit(): void {
    this.curso = this.cursoService.getCursoEscolhido();
    this.generatePdf();
  }

  async generatePdf(): Promise<void> {
    if (this.curso) {
      console.log(JSON.stringify(this.curso)); // Mostra o JSON do curso no console
      const pdfBlob = await this.pdfService.createDocument(this.curso, 'plano', 'aberturaCursoMilitar');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(pdfUrl);
      console.log(this.pdfUrl);
      this.generateCursosService.createCurso(this.curso)
    }
  }
  
}