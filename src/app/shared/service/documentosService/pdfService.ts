import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import { Curso } from '../../utilitarios/objetoCurso';
import { DocumentJsonService } from './documentJsonService';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  constructor(private documentJsonService: DocumentJsonService) {}

  async generateEditalPdf(curso: Curso): Promise<Blob> {
    const doc = new jsPDF();
    const editalCapacitacao = await this.documentJsonService.getEdital(curso,'Capacitacao').toPromise();
    await this.generateEdital(doc, editalCapacitacao);
    return new Promise<Blob>((resolve, reject) => {
      const pdfBlob = doc.output('blob');
      resolve(pdfBlob);
    });
  }
  async generatePlanoPdf(curso: Curso): Promise<Blob> {
    const doc = new jsPDF();
    const planoCapacitacao = await this.documentJsonService.getPlanoDeEnsino(curso,'Capacitacao').toPromise();
    await this.generateEdital(doc, planoCapacitacao);
    return new Promise<Blob>((resolve, reject) => {
      const pdfBlob = doc.output('blob');
      resolve(pdfBlob);
    });
  }
  

  private async generateEdital(doc: jsPDF, editalCapacitacao: any) {
    const capituloTitleFontSize = 11;
    const lineHeight = 6;
    let positionY = 7;

    positionY = await this.addHeader(doc,positionY,lineHeight);

    for (const capitulo of editalCapacitacao.documento) {
        if(capitulo.tipo === 'preambulo'){
            positionY = this.addPreamble(doc,positionY,lineHeight,capitulo.data);
        }else if(capitulo.tipo === 'intro'){
            positionY = this.addIntro(doc,positionY,lineHeight,capitulo.data);
        } else if (capitulo.tipo === 'capitulo') {
            positionY = this.createChapter(doc, capitulo.texto, capitulo.numero, positionY, lineHeight);
    
            if (capitulo.itens && capitulo.itens.length > 0) {
            for (const item of capitulo.itens) {
                if (item.tipo === 'tabela') {
                positionY = this.createTable(doc, positionY, item.dados, item.hasHeader, item.content,lineHeight);
                } else {
                positionY = this.createText(doc, item.texto, item.numero, positionY, lineHeight, 170, 25);
    
                if (item.subitens && item.subitens.length > 0) {
                    for (const subitem of item.subitens) {
                    if (subitem.tipo === 'tabela') {
                        positionY = this.createTable(doc, positionY, subitem.dados, subitem.hasHeader, subitem.content,lineHeight);
                    } else {
                        positionY = this.createText(doc, subitem.texto, subitem.letra, positionY, lineHeight, 170, 25);
    
                        if (subitem.subsubitens && subitem.subsubitens.length > 0) {
                        for (const subsubitem of subitem.subsubitens) {
                            if (subsubitem.tipo === 'tabela') {
                            positionY = this.createTable(doc, positionY, subsubitem.dados, subsubitem.hasHeader, subsubitem.content,lineHeight);
                            } else {
                            positionY = this.createText(doc, subsubitem.texto, subsubitem.letra, positionY, lineHeight, 170, 30);
    
                            if (subsubitem.subsubsubitens && subsubitem.subsubsubitens.length > 0) {
                                for (const subsubsubitem of subsubitem.subsubsubitens) {
                                if (subsubsubitem.tipo === 'tabela') {
                                    positionY = this.createTable(doc, positionY, subsubsubitem.dados, subsubsubitem.hasHeader, subsubsubitem.content,lineHeight);
                                } else {
                                    positionY = this.createText(doc, subsubsubitem.texto, subsubsubitem.letra, positionY, lineHeight, 155, 45);
                                }
                                }
                            }
                            }
                        }
                        }
                    }
                    }
                }
                }
            }
            }
        }
    }
  }
  
  // Adiciona o cabeçalho com imagem no PDF
  private async addHeader(doc: jsPDF, positionY: number, lineHeight: number): Promise<number> {
    const logoImg = await this.getBase64Image('assets/images/logo-CBMSC.png');
    doc.addImage(logoImg, 'PNG', 5, positionY, 18, 18);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text('ESTADO DE SANTA CATARINA', 25, positionY + lineHeight);
    doc.text('CORPO DE BOMBEIROS MILITAR DE SANTA CATARINA', 25, positionY + lineHeight * 2);
    doc.text('DIRETORIA DE INSTRUÇÃO E ENSINO (Florianópolis)', 25, positionY + lineHeight * 3);
    return positionY + lineHeight * 4;
  }

  // Adiciona o preambulo
  private  addPreamble(doc: jsPDF,positionY:number,lineHeight:number,data:string[]):number {
    let positionYAux = positionY+lineHeight*2;
    doc.setFont('helvetica', 'bold');
    doc.text(data[0], doc.internal.pageSize.getWidth() / 2, positionYAux, { align: 'center' });
    positionYAux = positionYAux+lineHeight*2;
    doc.setFont('helvetica', 'normal');
    doc.text(data[1], doc.internal.pageSize.getWidth() / 2,positionYAux , { align: 'center' });
    positionYAux = positionYAux+lineHeight*2;
    doc.setFont('helvetica', 'bold');
    doc.text(data[2], doc.internal.pageSize.getWidth() / 2, positionYAux, { align: 'center' });
    positionYAux = positionYAux+lineHeight;
    return positionYAux
  }

  private addIntro(doc: jsPDF,positionY:number,lineHeight:number,data:string):number {
    let positionYAux = positionY+lineHeight;
    positionYAux = this.addText(doc,positionYAux,data,170,25)
    return positionYAux
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
  private createChapter(doc: jsPDF, title: string,number: string, positionY: number, lineHeight: number): number {
    positionY = this.addLine(doc,positionY,lineHeight*2);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(number +" "+ title,25,positionY)
    positionY = this.addLine(doc,positionY,lineHeight);
    return positionY;
  }
  private createText(doc: jsPDF, title: string,number: string, positionY: number, lineHeight: number,maxWidth: number, marginLeftFirstLine:number): number {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    if(number !==""){
        positionY = this.addText(doc,positionY,number +" "+ title,maxWidth,marginLeftFirstLine);
    }else{
        positionY = this.addText(doc,positionY,title,maxWidth,marginLeftFirstLine);
    }
    return positionY;
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

  private addText(doc: jsPDF, positionY: number, data: string, maxWidth: number, marginLeftFirstLine: number): number {
    const paragraphText = data;
    const paragraphY = positionY;
    const lineHeight = 5;
  
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
  
    const lines = doc.splitTextToSize(paragraphText, maxWidth);
  
    let lastLineY = paragraphY; // Posição vertical da última linha
  
    for (let index = 0; index < lines.length; index++) {
      const line = lines[index];
      const lineY = lastLineY + lineHeight;
  
      // Verifica se há espaço disponível na página atual
      const pageHeight = doc.internal.pageSize.getHeight();
      const availableSpace = pageHeight - lineY;
      const requiredSpace = lineHeight;
  
      if (requiredSpace > availableSpace) {
        // Não há espaço suficiente, adiciona uma nova página
        doc.addPage();
        lastLineY = 20; // Reinicia a posição vertical na nova página
      }
  
      const marginLeft = index === 0 ? marginLeftFirstLine : 25; // Define a margem para a primeira linha
  
      doc.text(line, marginLeft, lastLineY, { align: 'justify' });
  
      lastLineY += lineHeight; // Atualiza a posição vertical da última linha
    }
  
    const paragraphBottomY = lastLineY; // Posição vertical da parte inferior do parágrafo
  
    return paragraphBottomY;
  }
  

  private createTable(doc: jsPDF, positionY: number, tableData: string[][], hasHeader: boolean, content: string, lineHeight: number): number {
    const startX = 25;
    const startY = positionY;
    const columnWidth = 80;
    const rowHeight = 9; // Altura inicial da linha
    const borderWidth = 0.2;
    const borderColor = 'black';
    const headerFontStyle = 'bold';
    const cellPaddingTop = 2; // Espaçamento superior da célula
  
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
  
    let lastRowY = startY; // Posição vertical da última linha
  
    for (let i = 0; i < tableData.length; i++) {
      const rowData = tableData[i];
      const rowY = lastRowY; // Mantém a posição vertical da linha anterior
  
      // Calcula a altura necessária para a linha com base no número de linhas de texto
      const numRows = Math.ceil(rowData.length / 3); // 3 é o número de colunas por linha
      const numLines = rowData.reduce((count, cellText) => count + doc.splitTextToSize(cellText, columnWidth - 2 * borderWidth).length, 0);
      const cellHeight = Math.max(rowHeight, lineHeight * numLines / numRows);
  
      // Atualiza a posição vertical da próxima linha com base na altura da célula
      lastRowY += cellHeight * numRows;
  
      for (let j = 0; j < rowData.length; j++) {
        const columnX = startX + (j % 3) * columnWidth; // 3 é o número de colunas por linha
        const cellWidth = columnWidth;
        const cellText = rowData[j];
  
        // Verifica se é o cabeçalho
        const isHeader = hasHeader && i === 0;
  
        // Definir estilo do texto
        const textStyle = isHeader ? headerFontStyle : 'normal';
  
        // Divide o texto em linhas
        const lines = doc.splitTextToSize(cellText, cellWidth - 2 * borderWidth);
  
        // Calcula a altura necessária para a célula
        const requiredCellHeight = lineHeight * lines.length;
  
        // Desenha as bordas da célula
        doc.setDrawColor(borderColor);
        doc.setLineWidth(borderWidth);
        doc.rect(columnX, rowY, cellWidth, cellHeight * numRows);
  
        // Adicionar texto da célula
        doc.setFont('helvetica', textStyle);
        if (content === 'left') {
          const marginLeft = 2; // Margem maior para tabela de síntese
          let textY = rowY + cellHeight - 2 - (numLines - 1) * lineHeight + cellPaddingTop;
          for (let k = 0; k < lines.length; k++) {
            doc.text(lines[k], columnX + borderWidth + marginLeft, textY);
            textY += lineHeight;
          }
        } else if (content === 'center') {
          const textX = columnX + cellWidth / 2;
          const textY = rowY + (cellHeight + 3) / 2;
          doc.text(lines, textX, textY, { align: 'center', maxWidth: cellWidth - borderWidth * 2 });
        }
      }
  
      // Verifica se a próxima linha excede a altura da página
      const pageHeight = doc.internal.pageSize.getHeight();
      if (lastRowY + borderWidth + 10 > pageHeight) {
        // Excede a altura da página, adiciona uma nova página
        doc.addPage();
        lastRowY = 20; // Reinicia a posição vertical na nova página
      }
    }
  
    const tableBottomY = lastRowY + borderWidth + lineHeight; // Posição vertical da parte inferior da tabela
  
    return tableBottomY;
  }
  
  
}
