import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import { CursoService } from 'src/app/shared/service/objetosCursosService';
import { Curso } from 'src/app/shared/utilitarios/objetoCurso';

@Component({
  selector: 'app-leitor-qt',
  templateUrl: './leitor-qt.component.html',
  styleUrls: ['./leitor-qt.component.css']
})
export class LeitorQTComponent implements OnInit {
  professores: any[] = []; // Array para armazenar os professores
  professoresCompilado: any[] = []; // Array para armazenar os professores
  cursoEscolhido: Curso | undefined ; 
  selectedFiles: File[] = [];
  objErro: any[] = [];
  constructor(private toastr: ToastrService, private cursoService: CursoService) {}

  onFileSelected(event: any): void {
    const files: FileList = event.target.files;
  
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = file.name;
  
        const isDuplicate = this.selectedFiles.some(selectedFile => selectedFile.name === fileName);
        if (!isDuplicate) {
          this.selectedFiles.push(file);
          this.readFiles();
        } else {
          this.toastr.warning(`Arquivo duplicado ou com nome inválido: ${fileName}`);
        }
      }
    }
  }
  ngOnInit(): void {
    this.cursoEscolhido = this.cursoService.getCursoEscolhido();
   
  }

  deleteFile(index: number): void {
    if (index >= 0 && index < this.selectedFiles.length) {
      this.selectedFiles.splice(index, 1);
      this.readFiles();
    }
  }
  
  readFiles(): void {
    this.professores = [];
  
    // Use uma lista de Promises para rastrear o término do processamento de cada arquivo
    const promises: Promise<void>[] = [];
  
    for (let i = 0; i < this.selectedFiles.length; i++) {
      const promise = new Promise<void>((resolve) => {
        this.readFile(this.selectedFiles[i], i, resolve);
      });
     promises.push(promise);
     
    }


  }
  
  
  readFile(file: File, index: number, resolve: () => void): void {
    const reader: FileReader = new FileReader();
  
    reader.onload = (e: any) => {
      const data = e.target.result;
      const professorsAux: any[] = [];
      this.processFileData(data, professorsAux, index);
      resolve();


    };

    reader.readAsBinaryString(file);
  }
  
  processFileData(data: string, professorsAux: any[], index: number): void {
    let errorArquivo = false;
    this.objErro = [];
    const workbook = XLSX.read(data, { type: 'binary' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
  
    // Limpar dados anteriores
    professorsAux = [];
  
    let error = this.processWorksheet(jsonData, professorsAux);
  
    if (!errorArquivo && !error) {
      this.professores.push(...professorsAux);
      this.professoresCompilado = [];
      this.professores.forEach(professor => {
        const professorAux = this.professoresCompilado.find(professorCompilado => professorCompilado.mtcl === professor.mtcl);
        if (!professorAux) {
          this.professoresCompilado.push({ ...professor, hai: 1 });
        } else {
          const index = this.professoresCompilado.indexOf(professorAux);
          this.professoresCompilado[index].hai = this.professoresCompilado[index].hai + 1;
        }
      });
    } else {
      // Adicione lógica para tratar erro de arquivo
       this.toastr.error(this.objErro[0]) 
       this.deleteFile(index)
    }
  }
   excelSerialToDate(serial:number):any {
    const msPerDay = 24 * 60 * 60 * 1000; // Número de milissegundos por dia
    const excelStartDate = new Date(1899, 11, 30); // Ajuste para levar em conta o deslocamento

    // Calcula a data adicionando o número de dias ao início do Excel
    const startDate = new Date(excelStartDate.getTime() + serial * msPerDay);

    const dateArray = [];
    
    for (let i = 0; i < 7; i++) {
        const currentDate = new Date(startDate.getTime() + i * msPerDay);
        dateArray.push(currentDate.toLocaleDateString());
    }

    return dateArray;
  }
  
  processWorksheet(jsonData: any[][], professorsAux: any[]): boolean {
    let errorArquivo = false;
    const dias = this.excelSerialToDate(jsonData[3][2])

    const indexes = [6, 8, 10, 12, 14];
    var regex = /\b\d+(\.\d+)+\b/;
    var numeroProcesso = jsonData[0][0].match(regex);

    if (numeroProcesso[0] != this.cursoEscolhido?.numeroProcesso) {
      this.objErro.push("Esse QT não pertence a esse processo."); 
      errorArquivo = true;
    } 
    
      jsonData.forEach((row: any, rowIndex: number) => {
      if (rowIndex >= 6 && rowIndex <= 75) {
        const diaIndex = Math.floor((rowIndex - 6) / 10);
        const dia = dias[diaIndex];
        
        indexes.forEach(index => {
          if (row[index]) {
            const error = this.addOrUpdateProfessor(index, row, dia, professorsAux);
            if (error) {
              console.log("Deu erro");
              errorArquivo = true;
            }
          }
        });
      }
    });

    return errorArquivo;
  }
  


addOrUpdateProfessor(mtclIndex: number, row: any, dia: string, professoresAux: any[]): any {
  const mtcl = row[mtclIndex];
  const hora = row[1];

  const verificacaoProfessor = professoresAux.find(professor => professor.mtcl === mtcl && professor.dia === dia && professor.hora === hora);
  if(!row[1]){
    this.objErro.push("O QT contém uma linha sem hora definida."); 
    return true;
  }
  if(!row[3]){
    this.objErro.push("O QT contém uma linha sem disciplina definida.");
    return true;
  }
  if(!row[4]){
    this.objErro.push("O QT contém uma linha sem sintese definida.");
    return true;
  }
  if (!verificacaoProfessor) {
    professoresAux.push(this.createProfessorObj(mtclIndex, row, dia));
    return false;
  } else {
    this.objErro.push("O arquivo apresenta erro na mtcl: "+mtcl+" na hora: "+ hora);
    return true;
  }
}

createProfessorObj(mtclIndex: number, row: any, dia: string): any {
  return {
    processo: "",
    mtcl: row[mtclIndex],
    name: row[mtclIndex + 1],
    hai: 1,
    dia: dia,
    hora: row[1]? row[1]:"",
    disp: row[3]? row[3]:"",
    sintese:row[4]? row[4]:"",
    falta: row[5]? row[5]:"0"
    
  };
}

downloadPDF(): void {
  const pdfContent = this.generateTablePDFContent();

  // Gera um Blob a partir da string de dados do PDF
  const blob = new Blob([pdfContent.data], { type: 'application/pdf' });

  // Cria um link para o Blob e realiza o download
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'output.pdf';
  a.click();

  // Limpa o objeto URL
  URL.revokeObjectURL(url);
}

generateTablePDFContent(): { data: string | Uint8Array; width: number; height: number } {
  const doc = new jsPDF();
  doc.setFontSize(4);

  // Agrupa professores por dia
  const professoresPorDia: { [dia: string]: any[] } = {};
  this.professores.forEach(professor => {
    if (!professoresPorDia[professor.dia]) {
      professoresPorDia[professor.dia] = [];
    }
    professoresPorDia[professor.dia].push(professor);
  });

  let startY = 0;
  let chapterNumber = 0;

  // Itera sobre os grupos (dias)
  for (const dia in professoresPorDia) {
    if (professoresPorDia.hasOwnProperty(dia)) {
      const professoresDoDia = professoresPorDia[dia];
      const professoresPorDiaEHora: { [hora: string]: any[] } = {};
      professoresDoDia.forEach(professor => {
        if (!professoresPorDiaEHora[professor.hora]) {
          professoresPorDiaEHora[professor.hora] = [];
        }
        professoresPorDiaEHora[professor.hora].push(professor);
      });

      startY = startY + 20;
      chapterNumber = chapterNumber + 1;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(`${chapterNumber}) Aulas do dia ${dia}`, 10, startY);
      let aulaNumber =0;
      for (const hora in professoresPorDiaEHora) {
        startY = startY + 15;

        const professoresPorHora = professoresPorDiaEHora[hora];
        aulaNumber = aulaNumber+1;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        let textFaltas ="";
        if(parseFloat(professoresPorHora[0].falta) == 0){textFaltas = 'sem faltas.'};
        if(parseFloat(professoresPorHora[0].falta) > 0){textFaltas = `com um total de ${professoresPorHora[0].falta} faltas`};
        if(parseFloat(professoresPorHora[0].falta) < 0){textFaltas = `com um total de ${professoresPorHora[0].falta} falta`};
        
        doc.text(`${chapterNumber}.${aulaNumber}) Professores que ministraram no turno ${hora} com sintese "${professoresPorHora[0].sintese}", ${textFaltas}  `, 10, startY);

        const cellWidthArray = [20, 60, 30, 90];
        const startXArray = [5, 5 + cellWidthArray[0], 5 + cellWidthArray[0] + cellWidthArray[1], 5 + cellWidthArray[0] + cellWidthArray[1] + cellWidthArray[2]];
        const cabecalho = ["Hora", "Sintese", "Matricula", "Nome"];
  
        startY = startY + 5;
        const cellPadding = 1;
        const lineHeight = 4;
  
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
  
        for (let i = 0; i < 4; i++) {
          doc.rect(startXArray[i], startY, cellWidthArray[i], lineHeight);
          doc.text(cabecalho[i], startXArray[i] + cellPadding, startY + cellPadding + lineHeight / 2);
        }
  
        let index = 0;
        let rowY = 0;
  
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        const pageHeight = doc.internal.pageSize.getHeight();
  
        professoresPorHora.forEach(professor => {
          if (rowY+10 > pageHeight) {
            // Adiciona Página
            doc.addPage();
            startY = 0;
          }
          rowY = startY + (index + 1) * lineHeight;
          for (let i = 0; i < 4; i++) {
            doc.rect(startXArray[i], rowY, cellWidthArray[i], lineHeight);
            const content = this.getContentForColumn(i, professor);
            doc.text(content, startXArray[i] + cellPadding, rowY + cellPadding + lineHeight / 2);
          }
          index = index + 1;
        })
  
        startY = rowY;
  
        if (startY + 30 > pageHeight) {
          // Adiciona Página
          doc.addPage();
          startY = 0;
        }
      
      }



    }
  }

  // Salva o documento como uma string de dados do PDF
  const pdfContent = doc.output();

  return {
    data: pdfContent,
    width: doc.internal.pageSize.getWidth(),
    height: doc.internal.pageSize.getHeight()
  };
}

getContentForColumn(columnIndex: number, professor: any): string {
  // Adapte essa função para obter o conteúdo correto para cada coluna com base no índice da coluna
  switch (columnIndex) {
    case 0: return professor.hora;
    case 1: return professor.disp;
    case 2: return professor.mtcl;
    case 3: return professor.name;
    // Adicione mais casos conforme necessário
    default: return '';
  }
}



  
}
