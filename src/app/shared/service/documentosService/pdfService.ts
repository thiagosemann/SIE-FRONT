import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import { Curso } from '../../utilitarios/objetoCurso';
import { DocumentTextService } from './documentTextService';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  constructor(private documentTextService : DocumentTextService ){}
  async generatePdf(curso:Curso): Promise<Blob> {
    const doc = new jsPDF();
    await this.generateEditalCapacitacao(doc,curso);

    return new Promise<Blob>((resolve, reject) => {
      const pdfBlob = doc.output('blob');
      resolve(pdfBlob);
    });
  }
  // ----------------------------------------------------------------------------TIPO DE DOCUMENTO --------------------------------------------------------//
  private async generateEditalCapacitacao(doc: jsPDF, curso:Curso) {
    // Dados Falsos
    console.log(curso)
    const sinteseData = [
      ['Nome da atividade de ensino', 'Dado 2'],
      ['Coordenador da atividade de ensino', curso.coordenador?.nomeCompleto || ''],
      ['Período de inscrição', 'Dado 6'],
      ['Período da atividade de ensino', 'Dado 8'],
      ['Local de apresentação dos alunos', 'Dado 10'],
      ['Data e hora de apresentação dos alunos', 'Dado 12'],
      ['Carga horária total', 'Dado 14'],
      ['Finalidade', 'Dado 16']
    ];
  
    const vagasData = [
      ['Batalhão', 'Quantidade'],
      ['1ºBBM', '2'],
      ['2ºBBM', '4'],
      ['3ºBBM', '6'],
      ['4ºBBM', '8']
    ];

    const matIndData = [
      ['Material', 'Quantidade'],
      ['Martelo', '2'],
      ['Alicate', '4'],
      ['Teste', '6'],
      ['Teste', '8']
    ];


    // Parte Inicial
    const lineHeight = 5;
    await this.addHeader(doc);
    this.addPreamble(doc);
    let positionY = this.addText(doc, 70, this.documentTextService.getApresentacao('Data','Nome','Sigla',curso.bbm || '','Municipio'),false);
    // Conteúdo
    positionY = this.addLine(doc,positionY,lineHeight);
    // Capítulo 1
    positionY = this.createSintese(doc,'1 SÍNTENSE',positionY,lineHeight,sinteseData);
    // Capítulo 2
    positionY = this.createVagas(doc,this.documentTextService.getChapter2(),positionY,lineHeight,vagasData);
    // Capítulo 3
    positionY = this.createRequisitos(doc,this.documentTextService.getChapter3(),positionY,lineHeight,matIndData);
    // Capítulo 4 
    positionY = this.createChapter(doc,'4 INSCRIÇÕES',this.documentTextService.getChapter4(),positionY,lineHeight)
    // Capítulo 5
    positionY = this.createChapter(doc,'5 PROCESSO SELETIVO',this.documentTextService.getChapter5(),positionY,lineHeight)
    // Capítulo 6
    positionY = this.createChapter(doc,'6 DIVULGAÇÃO DO RESULTADO',this.documentTextService.getChapter6(),positionY,lineHeight)
    // Capítulo 7
    positionY = this.createChapter(doc,'7 ATIVIDADES PRELIMINARES',this.documentTextService.getChapter7(),positionY,lineHeight)
    // Capítulo 8
    positionY = this.createLogistica(doc,this.documentTextService.getChapter8(),positionY,lineHeight,matIndData);
    // Capítulo 9
    positionY = this.createChapter(doc,'9 PRESCRIÇÕES DIVERSAS',this.documentTextService.getChapter9(),positionY,lineHeight)
    // Capítulo 10
    positionY = this.createChapter(doc,'10 PRESCRIÇÕES DIVERSAS',this.documentTextService.getChapter10(),positionY,lineHeight)
  }
  

  // ----------------------------------------------------------------------------UTILIDADES --------------------------------------------------------------//
  createSintese(doc: jsPDF, title: string,positionY:number,lineHeight:number,sinteseData:string[][]):number{
    this.addTextSmall(doc, title, 25, positionY, 11, 'bold');
    positionY = this.addLine(doc,positionY,lineHeight);
    positionY = this.createTable(doc, positionY, sinteseData, false, 'Sintese');
    positionY = this.addLine(doc,positionY,lineHeight*2);
    return positionY;
  }

  createVagas(doc: jsPDF, tableData: string[],positionY:number,lineHeight:number,vagasData:string[][]):number{
    this.addTextSmall(doc, tableData[0], 25, positionY, 11, 'bold');
    positionY = this.addLine(doc,positionY,lineHeight);
    positionY = this.createTable(doc, positionY, vagasData, true, 'Vagas');
    positionY = this.addLine(doc,positionY,lineHeight*2);
    positionY = this.addText(doc,positionY,tableData[1],false);
    positionY = this.addLine(doc,positionY,lineHeight);
    positionY = this.addText(doc,positionY,tableData[2],false);
    positionY = this.addLine(doc,positionY,lineHeight);
    positionY = this.addText(doc,positionY,tableData[3],false);
    positionY = this.addLine(doc,positionY,lineHeight*2);
    return positionY;
  }
  
  createRequisitos(doc: jsPDF, tableData: string[],positionY:number,lineHeight:number,matIndData:string[][]):number{
    this.addTextSmall(doc, tableData[0], 25, positionY, 11, 'bold');
    positionY = this.addLine(doc,positionY,lineHeight*2);
    this.addTextSmall(doc, tableData[1], 25, positionY, 11, 'normal');
    positionY = this.addLine(doc,positionY,lineHeight);
    positionY = this.addText(doc,positionY, tableData[2],false);
    positionY = this.addText(doc,positionY, tableData[3],false);
    positionY = this.addText(doc,positionY, tableData[4],false);
    positionY = this.addText(doc,positionY, tableData[5],false);
    positionY = this.addText(doc,positionY, tableData[6],false);
    positionY = this.addText(doc,positionY, tableData[7],false);
    positionY = this.addText(doc,positionY, tableData[8],false);
    positionY = this.addLine(doc,positionY,lineHeight);
    positionY = this.addText(doc,positionY, tableData[9],false);
    positionY = this.addText(doc,positionY, tableData[10],false);
    positionY = this.addText(doc,positionY, tableData[11],false);
    positionY = this.addText(doc,positionY, tableData[12],true);
    positionY = this.addText(doc,positionY, tableData[13],true);
    positionY = this.addText(doc,positionY, tableData[14],true);
    positionY = this.addLine(doc,positionY,lineHeight);
    positionY = this.addText(doc,positionY, tableData[15],false);
    positionY = this.addLine(doc,positionY,lineHeight);
    this.addTextSmall(doc,tableData[16] , 25, positionY, 11, 'normal');
    positionY = this.addLine(doc,positionY,lineHeight);
    positionY = this.addText(doc,positionY, tableData[17],false);
    positionY = this.addLine(doc,positionY,lineHeight);
    this.addTextSmall(doc, tableData[18], 25, positionY, 11, 'normal');
    positionY = this.addLine(doc,positionY,lineHeight);
    positionY = this.addText(doc,positionY, tableData[19],false);
    positionY = this.addLine(doc,positionY,lineHeight*2);
    return positionY ;
  }
  createLogistica(doc: jsPDF, tableData: string[],positionY:number,lineHeight:number,matIndData:string[][]):number{
    this.addTextSmall(doc,tableData[0], 25, positionY, 11, 'bold');
    positionY = this.addLine(doc,positionY,lineHeight*2);
    this.addTextSmall(doc,tableData[1] , 25, positionY, 11, 'normal');
    positionY = this.addLine(doc,positionY,lineHeight);
    positionY = this.addText(doc,positionY,tableData[2],false);
    positionY = this.addLine(doc,positionY,lineHeight);
    this.addTextSmall(doc,tableData[3] , 25, positionY, 11, 'normal');
    positionY = this.addLine(doc,positionY,lineHeight);
    positionY = this.addText(doc,positionY, tableData[4],false);
    positionY = this.addText(doc,positionY, tableData[5],false);
    positionY = this.addLine(doc,positionY,lineHeight);
    this.addTextSmall(doc, tableData[6], 25, positionY, 11, 'normal');
    positionY = this.addLine(doc,positionY,lineHeight);
    positionY = this.addText(doc,positionY, tableData[7],false);
    positionY = this.addLine(doc,positionY,lineHeight);
    this.addTextSmall(doc, tableData[8], 25, positionY, 11, 'normal');
    positionY = this.addLine(doc,positionY,lineHeight);
    positionY = this.addText(doc,positionY, tableData[9],false);
    positionY = this.addText(doc,positionY, tableData[10],false);
    positionY = this.addText(doc,positionY, tableData[11],false);
    positionY = this.addLine(doc,positionY,lineHeight);
    this.addTextSmall(doc, tableData[12], 25, positionY, 11, 'normal');
    positionY = this.addLine(doc,positionY,lineHeight);
    positionY = this.addText(doc,positionY, tableData[13],false);
    positionY = this.addLine(doc,positionY,lineHeight);
    this.addTextSmall(doc, tableData[14], 25, positionY, 11, 'normal');
    positionY = this.addLine(doc,positionY,lineHeight);
    positionY = this.addText(doc,positionY, tableData[15],false);
    positionY = this.addLine(doc,positionY,lineHeight);
    this.addTextSmall(doc, tableData[16], 25, positionY, 11, 'normal');
    positionY = this.addLine(doc,positionY,lineHeight);
    positionY = this.addText(doc,positionY, tableData[17],false);
    positionY = this.createTable(doc, positionY, matIndData, true, 'Vagas');
    positionY = this.addLine(doc,positionY,lineHeight);
    positionY = this.addText(doc,positionY, tableData[18],false);
    positionY = this.createTable(doc, positionY, matIndData, true, 'Vagas');
    positionY = this.addLine(doc,positionY,lineHeight);
    positionY = this.addText(doc,positionY, tableData[19],false);
    positionY = this.addLine(doc,positionY,lineHeight*2);
    return positionY;
  }
  
  createChapter(doc: jsPDF,title:string, tableData: string[],positionY:number,lineHeight:number):number{
    this.addTextSmall(doc,title, 25, positionY, 11, 'bold');
    positionY = this.addLine(doc,positionY,lineHeight*2);
    tableData.forEach((data: string) => {
      positionY = this.addText(doc,positionY, data,false);
      positionY = this.addLine(doc,positionY,lineHeight);
    });
    positionY = this.addLine(doc,positionY,lineHeight);
    return positionY;
  }
  
  
  addTextSmall(doc: jsPDF,text:string,positionX:number,positionY:number,fontSize:number,fontWeigth:string){
    doc.setFont('helvetica', fontWeigth);
    doc.setFontSize(fontSize);
    doc.text(text, positionX, positionY);
  }
  addLine(doc: jsPDF, positionY: number, size: number): number {
    const pageHeight = doc.internal.pageSize.getHeight();
    const requiredSpace = positionY + size;
  
    if (requiredSpace > pageHeight) {
      doc.addPage();
      positionY = 20; // Reinicia a posição vertical na nova página
      return positionY;
    }
  
    return positionY + size;
  }


  // Adiciona o cabeçalho com imagem no PDF
  private async addHeader(doc: jsPDF) {
    const logoImg = await this.getBase64Image('assets/images/logo-CBMSC.png');
    doc.addImage(logoImg, 'PNG', 5, 7, 18, 18);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('ESTADO DE SANTA CATARINA', 25, 12);
    doc.text('CORPO DE BOMBEIROS MILITAR DE SANTA CATARINA', 25, 17);
    doc.text('DIRETORIA DE INSTRUÇÃO E ENSINO (Florianópolis)', 25, 22);
  }

  // Adiciona o preambulo
  private  addPreamble(doc: jsPDF) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('EDITAL {procNum}/{anoAtual}/DIE/CBMSC', doc.internal.pageSize.getWidth() / 2, 40, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('Código de autenticação para uso da DIE: {auth}', doc.internal.pageSize.getWidth() / 2, 50, { align: 'center' });
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('{procNome} ({procSigla})', doc.internal.pageSize.getWidth() / 2, 60, { align: 'center' });
  }
  

  // Adiciona um paragrafo
  private addText(doc: jsPDF, positionY: number, data: string, isSubitem: boolean): number {
    const paragraphText = data;
    const paragraphY = positionY;
    const lineHeight = 5;
    const maxWidth = isSubitem ? 160 : 170;
    const marginLeftFirstLine = isSubitem ? 35 : 25;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    
    const lines = doc.splitTextToSize(paragraphText, maxWidth);
    
    let lastLineY = 0; // Posição vertical da última linha
    
    for (let index = 0; index < lines.length; index++) {
      const line = lines[index];
      let lineY = paragraphY + index * lineHeight;
    
      // Verifica se há espaço disponível na página atual
      const pageHeight = doc.internal.pageSize.getHeight();
      const availableSpace = pageHeight - lineY;
      const requiredSpace = lineHeight;
    
      if (requiredSpace > availableSpace) {
        // Não há espaço suficiente, adiciona uma nova página
        doc.addPage();
        positionY = 20; // Reinicia a posição vertical na nova página
        lastLineY = positionY; // Atualiza a posição vertical da última linha na nova página
        lineY = positionY;
      }
    
      const marginLeft = index === 0 ? marginLeftFirstLine : 25; // Define a margem para cada linha
    
      doc.text(line, marginLeft, lineY, { align: 'justify' });
    
      lastLineY = lineY; // Atualiza a posição vertical da última linha
    }
    
    const paragraphBottomY = lastLineY + lineHeight; // Posição vertical da parte inferior do parágrafo
    
    return paragraphBottomY;
  }
  
  

  // Código para criar uma tabela genérica.
  
  private createTable(doc: jsPDF, positionY: number, tableData: string[][], hasHeader: boolean, tableName: string): number {
    const startX = 25;
    const startY = positionY;
    const columnWidth = 80;
    const rowHeight = 10;
    const borderWidth = 1;
    const borderColor = 'black';
    const headerFontStyle = 'bold';
  
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
  
    let lastRowY = startY; // Posição vertical da última linha
  
    for (let i = 0; i < tableData.length; i++) {
      const rowData = tableData[i];
      const rowY = lastRowY; // Mantém a posição vertical da linha anterior
  
      for (let j = 0; j < rowData.length; j++) {
        const columnX = startX + j * columnWidth;
        const cellWidth = columnWidth;
        const cellHeight = rowHeight;
        const cellText = rowData[j];
  
        // Verifica se é o cabeçalho
        const isHeader = hasHeader && i === 0;
  
        // Definir estilo do texto
        const textStyle = isHeader ? headerFontStyle : 'normal';
  
        // Desenhar borda externa
        doc.setDrawColor(borderColor);
        doc.rect(columnX, rowY, cellWidth, cellHeight, 'S');
  
        // Adicionar texto da célula
        doc.setFont('helvetica', textStyle);
        if (tableName === 'Sintese') {
          const marginLeft = 2; // Margem maior para tabela de síntese
          doc.text(cellText, columnX + borderWidth + marginLeft, rowY + cellHeight - 2, {
            align: 'left',
            maxWidth: cellWidth - borderWidth * 2,
          });
        } else if (tableName === 'Vagas') {
          const textWidth = doc.getTextWidth(cellText);
          const textX = columnX + cellWidth / 2;
          const textY = rowY + (cellHeight + 3) / 2;
  
          doc.text(cellText, textX, textY, { align: 'center', maxWidth: cellWidth - borderWidth * 2 });
        }
      }
  
      lastRowY += rowHeight; // Atualiza a posição vertical da última linha
  
      // Verifica se a próxima linha excede a altura da página
      const pageHeight = doc.internal.pageSize.getHeight();
      if (lastRowY + rowHeight + borderWidth +10 > pageHeight) {
        // Excede a altura da página, adiciona uma nova página
        doc.addPage();
        lastRowY = 20; // Reinicia a posição vertical na nova página
      }
    }
  
    const tableBottomY = lastRowY + borderWidth; // Posição vertical da parte inferior da tabela
  
    return tableBottomY;
  }
  

  // Função para converter a imagem em formato base64
  private getBase64Image(url: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = function () {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      };
      img.onerror = function () {
        reject(new Error('Failed to load image'));
      };
      img.src = url;
    });
  }
}