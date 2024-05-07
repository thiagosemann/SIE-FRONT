import { jsPDF } from 'jspdf';

export class PDFHelper {

 async generateDocumento(doc: jsPDF, editalCapacitacao: any, model:string) {
    const capituloTitleFontSize = 11;
    const lineHeight = 6;
    let positionY = 7;
    let startX = 5;
  
    if(model=="rfc"){
      startX = 5;
    }
    positionY = await this.addHeader(doc, positionY, lineHeight);
  
    for (const capitulo of editalCapacitacao.documento) {
        switch (capitulo.tipo) {
          case "preambulo":
            positionY = this.addPreamble(doc, positionY, lineHeight, capitulo.data);
            break;
          case "intro":
            positionY = this.addIntro(doc, positionY, lineHeight, capitulo.texto,startX);
            break;
          case "capitulo":
            positionY = this.createChapter(doc,capitulo.texto,capitulo.numero,positionY,lineHeight,startX);
            if (capitulo.itens && capitulo.itens.length > 0) {
              positionY = await this.processItens(doc, capitulo.itens, positionY, lineHeight,startX);
            }
            break;
        }
    }
  }
  
   async processItens(doc: jsPDF, itens: any[], positionY: number, lineHeight: number,startX:number) {
    for (const item of itens) {
        if (item.tipo === "tabela") {
          positionY = this.createTable(doc,positionY,item.dados,item.hasHeader,item.content,lineHeight,25,81);
        }else if(item.tipo === "tabelaRFC"){
          positionY = this.createTableRFC(doc,positionY,item.dados,item.hasHeader,item.content,lineHeight,item.tipo);
        }else if(item.tipo === "tabelaRFCSintese"){
          positionY = this.createTable(doc,positionY,item.dados,item.hasHeader,item.content,lineHeight,5,100);
        }else {
          positionY = this.createText(doc,item.texto,item.numero,positionY,lineHeight,startX);
  
          if (item.subitens && item.subitens.length > 0) {
            positionY = await this.processSubItens(doc, item.subitens, positionY, lineHeight,startX);
          }
        }
    }
  
    return positionY;
  }
  
   async processSubItens(doc: jsPDF, subitens: any[], positionY: number, lineHeight: number,startX:number) {
    for (const subitem of subitens) {
        if (subitem.tipo === "tabela") {
          positionY = this.createTable(doc,positionY,subitem.dados,subitem.hasHeader,subitem.content,lineHeight,25,81);
  
        }else if(subitem.tipo === "tabelaRFC"){
          positionY = this.createTableRFC(doc,positionY,subitem.dados,subitem.hasHeader,subitem.content,lineHeight,subitem.tipo);
        }else if(subitem.tipo === "tabelaRFCSintese"){
          positionY = this.createTable(doc,positionY,subitem.dados,subitem.hasHeader,subitem.content,lineHeight,5,100);
        }  else {
          positionY = this.createText(doc,subitem.texto,subitem.letra,positionY,lineHeight,startX);
          if (subitem.subsubitens && subitem.subsubitens.length > 0) {
            positionY = await this.processSubSubItens(doc, subitem.subsubitens, positionY, lineHeight,startX);
          }
        }
    }
  
    return positionY;
  }
  
   async processSubSubItens(doc: jsPDF, subsubitens: any[], positionY: number, lineHeight: number,startX:number) {
    for (const subsubitem of subsubitens) {
        if (subsubitem.tipo === "tabela") {
          positionY = this.createTable(doc,positionY,subsubitem.dados,subsubitem.hasHeader,subsubitem.content,lineHeight,25,81);
        }else if(subsubitem.tipo === "tabelaRFC"){
          positionY = this.createTableRFC(doc,positionY,subsubitem.dados,subsubitem.hasHeader,subsubitem.content,lineHeight,subsubitem.tipo);
        }else if(subsubitem.tipo === "tabelaRFCSintese" ){
          positionY = this.createTable(doc,positionY,subsubitem.dados,subsubitem.hasHeader,subsubitem.content,lineHeight,5,100);
        }else {
          positionY = this.createText(doc,subsubitem.texto,subsubitem.letra,positionY,lineHeight,startX);
  
          if (subsubitem.subsubsubitens && subsubitem.subsubsubitens.length > 0) {
            positionY = await this.processSubSubSubItens(doc, subsubitem.subsubsubitens, positionY, lineHeight,startX);
          }
        }
    }
  
    return positionY;
  }
  
   async processSubSubSubItens(doc: jsPDF, subsubsubitens: any[], positionY: number, lineHeight: number,startX:number) {
    for (const subsubsubitem of subsubsubitens) {
        if (subsubsubitem.tipo === "tabela") {
          positionY = this.createTable(doc, positionY,subsubsubitem.dados,subsubsubitem.hasHeader,subsubsubitem.content, lineHeight,25,81);     
        }else if(subsubsubitem.tipo === "tabelaRFC"){
          positionY = this.createTableRFC(doc,positionY,subsubsubitem.dados,subsubsubitem.hasHeader,subsubsubitem.content,lineHeight,subsubsubitem.tipo);
        }else if(subsubsubitem.tipo === "tabelaRFCSintese"){
          positionY = this.createTable(doc, positionY,subsubsubitem.dados,subsubsubitem.hasHeader,subsubsubitem.content, lineHeight,5,100);
        }else {
          positionY = this.createText(doc,subsubsubitem.texto,subsubsubitem.letra,positionY,lineHeight,startX);
        }
    }
  
    return positionY;
  }
    
    // Adiciona o cabeçalho com imagem no PDF
     async addHeader(doc: jsPDF, positionY: number, lineHeight: number): Promise<number> {
      const logoImg = await this.getBase64Image('assets/images/logo-CBMSC.png');
      doc.addImage(logoImg, 'PNG', 5, positionY, 18, 18);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.text('ESTADO DE SANTA CATARINA', 25, positionY + lineHeight);
      doc.text('CORPO DE BOMBEIROS MILITAR DE SANTA CATARINA', 25, positionY + lineHeight * 2);
      doc.text('DIRETORIA DE INSTRUÇÃO E ENSINO (Florianópolis)', 25, positionY + lineHeight * 3);
      return positionY + lineHeight * 3;
    }
  
    // Adiciona o preambulo
      addPreamble(doc: jsPDF,positionY:number,lineHeight:number,data:string[]):number {
      let positionYAux = positionY+lineHeight*2;
      doc.setFont('helvetica', 'bold');
      doc.text(data[0], doc.internal.pageSize.getWidth() / 2, positionYAux, { align: 'center' });
      positionYAux = positionYAux+lineHeight*1.2;
      doc.setFont('helvetica', 'normal');
      doc.text(data[1], doc.internal.pageSize.getWidth() / 2,positionYAux , { align: 'center' });
      positionYAux = positionYAux+lineHeight*1.2;
      doc.setFont('helvetica', 'bold');
      doc.text(data[2], doc.internal.pageSize.getWidth() / 2, positionYAux, { align: 'center' });
      positionYAux = positionYAux+lineHeight*1.2;
      return positionYAux
    }
  
     addIntro(doc: jsPDF,positionY:number,lineHeight:number,data:string,startX:number):number {
      let positionYAux = positionY+lineHeight;
      positionYAux = this.addText(doc,positionYAux,data,startX)
      return positionYAux
    }
  
  // Função para converter a imagem em formato base64
       getBase64Image(url: string): Promise<string> {
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
       createChapter(doc: jsPDF, title: string, number: string, positionY: number, lineHeight: number,startX:number): number {
        const chapterHeight = lineHeight * 3; // Assuming the chapter title takes up three lines
        const spaceRequired = chapterHeight + lineHeight; // Add some extra space for safety
        
        // Check if adding the chapter title exceeds the page height
        if (positionY + spaceRequired > doc.internal.pageSize.getHeight()) {
          doc.addPage();
          positionY = 20; // Reset the vertical position on the new page
        }
        
        positionY = this.addLine(doc, positionY, lineHeight * 2);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(number + " " + title, startX, positionY);
        positionY = this.addLine(doc, positionY, lineHeight);
        
        return positionY;
      }
      
     createText(doc: jsPDF, title: string,number: string, positionY: number, lineHeight: number, startX:number): number {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      if(number !==""){
          positionY = this.addText(doc,positionY,number +" "+ title,startX);
      }else{
          positionY = this.addText(doc,positionY,title,startX);
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
  
    addText(doc: jsPDF, positionY: number, data: string, startX: number): number {
      const paragraphText = data;
      const paragraphY = positionY;
      const lineHeight = 5;
      const widthMax = doc.internal.pageSize.getWidth() -5;
      let fontSize = 11;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(fontSize);
    
      const lines = doc.splitTextToSize(paragraphText, widthMax);
      let lastLineY = paragraphY; // Posição vertical da última linha
    
      for (let index = 0; index < lines.length; index++) {
        const line = lines[index];
        const lineY = lastLineY + lineHeight;
        const words = line.split(' ');
    
        const totalWordWidth = words.reduce((acc: number, word: string) => {
          const wordWidth = doc.getStringUnitWidth(word) * fontSize / doc.internal.scaleFactor;
          return acc + wordWidth;
        }, 0);
        const marginLeft = index === 0 ? startX + 5 : startX; // Define a margem para a primeira linha

        const extraSpace = widthMax - totalWordWidth - marginLeft;

        if (extraSpace > 0 && words.length > 1 && line.length > 90) {
          const spaceBetweenWords = extraSpace / (words.length - 1);
          let currentX = marginLeft;
    
          for (let i = 0; i < words.length; i++) {
            const wordWidth = doc.getStringUnitWidth(words[i]) * fontSize / doc.internal.scaleFactor;
            doc.text(words[i], currentX, lastLineY);
            currentX += wordWidth + spaceBetweenWords;
          }
        } else {
          doc.text(line, marginLeft, lastLineY, { align: 'left' });
        }
    
        // Verifica se há espaço disponível na página atual
        const pageHeight = doc.internal.pageSize.getHeight();
        const availableSpace = pageHeight - lineY;
        const requiredSpace = lineHeight;
    
        if (requiredSpace > availableSpace) {
          // Não há espaço suficiente, adiciona uma nova página
          doc.addPage();
          lastLineY = 20; // Reinicia a posição vertical na nova página
        } else {
          lastLineY += lineHeight; // Atualiza a posição vertical da última linha
        }
      }
    
      const paragraphBottomY = lastLineY; // Posição vertical da parte inferior do parágrafo
    
      return paragraphBottomY;
    }
    

     createTable(doc: jsPDF, positionY: number, tableData: string[][], hasHeader: boolean, content: string, lineHeight: number, startX: number, columnWidth: number): number {
      const startY = positionY;
      const rowHeight = 5; // Altura inicial da linha
      const borderWidth = 0.2;
      const borderColor = 'black';
      const headerFontStyle = 'bold';
      const cellPaddingTop = 2; // Espaçamento superior da célula
      const pageHeight = doc.internal.pageSize.getHeight();
  
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
    
      let lastRowY = startY; // Posição vertical da última linha
      if(startY + rowHeight > pageHeight ){
        // Excede a altura da página, adiciona uma nova página
        doc.addPage();
        lastRowY = 20; // Reinicia a posição vertical na nova página
      }
  
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
          const lines = doc.splitTextToSize(cellText, cellWidth - 2 * borderWidth -4);
    
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
        if (lastRowY + borderWidth +20 > pageHeight) {
          // Excede a altura da página, adiciona uma nova página
          doc.addPage();
          lastRowY = 20; // Reinicia a posição vertical na nova página
        }
      }
    
      const tableBottomY = lastRowY + borderWidth + lineHeight; // Posição vertical da parte inferior da tabela
    
      return tableBottomY;
    }
    
     createTableRFC(doc: jsPDF, positionY: number, tableData: string[][], hasHeader: boolean, content: string, lineHeight: number,tipo:string): number {
      let startX = 5;
      const startY = positionY;
      let columnWidths=[];
      
      const rowHeight = 10; // Altura inicial da linha
      const borderWidth = 0.3;
      const borderColor = 'black';
      const headerFontStyle = 'bold';
      const cellPaddingTop = 2; // Espaçamento superior da célula
      const pageHeight = doc.internal.pageSize.getHeight();
  
      if(tableData[0].length==8){
        columnWidths = [10, 30, 30, 50, 12, 15, 18, 35]; 
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6); // Tamanho da fonte alterado para 6
      }else {
        columnWidths = [16, 30, 40, 25, 19, 13, 19, 19, 19];
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6); // Tamanho da fonte alterado para 6
      }
  
  
      let lastRowY = startY; // Posição vertical da última linha
      if (startY + rowHeight > pageHeight) {
          // Excede a altura da página, adiciona uma nova página
          doc.addPage();
          lastRowY = 20; // Reinicia a posição vertical na nova página
      }
  
      for (let i = 0; i < tableData.length; i++) {
          const rowData = tableData[i];
          const rowY = lastRowY; // Mantém a posição vertical da linha anterior
  
          // Calcula a altura necessária para a linha com base no número de linhas de texto
          let maxCellHeight = 0;
          for (const cellText of rowData) {
              for (let j = 0; j < columnWidths.length; j++) {
                  const lines = doc.splitTextToSize(cellText, columnWidths[j] - 2 * borderWidth);
                  const numLines = lines.length;
                  const cellHeight = Math.max(rowHeight, 3 * numLines);
                  maxCellHeight = Math.max(maxCellHeight, cellHeight);
              }
          }
  
          // Atualiza a posição vertical da próxima linha com base na altura da célula
          lastRowY += maxCellHeight;
  
          for (let j = 0; j < rowData.length; j++) {
              const columnX = startX + columnWidths.slice(0, j).reduce((acc, curr) => acc + curr, 0); // Calcula a posição horizontal da coluna
              const cellWidth = columnWidths[j];
              const cellText = rowData[j];
  
              // Verifica se é o cabeçalho
              const isHeader = hasHeader && i === 0;
  
              // Definir estilo do texto
              const textStyle = isHeader ? headerFontStyle : 'normal';
  
              // Divide o texto em linhas
              const lines = doc.splitTextToSize(cellText, cellWidth - 2 * borderWidth - 4);
  
              // Desenha as bordas da célula
              doc.setDrawColor(borderColor);
              doc.setLineWidth(borderWidth);
              doc.rect(columnX, rowY, cellWidth, maxCellHeight);
  
              // Adicionar texto da célula
              doc.setFont('helvetica', textStyle);
              if (content === 'left') {
                  const marginLeft = 2; 
                  let textY = rowY + maxCellHeight - 2 - (lines.length - 1) * lineHeight + cellPaddingTop;
                  for (let k = 0; k < lines.length; k++) {
                      doc.text(lines[k], columnX + borderWidth + marginLeft, textY);
                      textY += lineHeight;
                  }
              } else if (content === 'center') {
                  const textX = columnX + cellWidth / 2;
                  const textY = rowY + (maxCellHeight + 3) / 2;
                  doc.text(lines, textX, textY, { align: 'center', maxWidth: cellWidth - borderWidth * 2 });
              }
          }
  
          // Verifica se a próxima linha excede a altura da página
          if (lastRowY + borderWidth + 20 > pageHeight) {
              // Excede a altura da página, adiciona uma nova página
              doc.addPage();
              lastRowY = 20; // Reinicia a posição vertical na nova página
          }
      }
  
      const tableBottomY = lastRowY + borderWidth + lineHeight; // Posição vertical da parte inferior da tabela
  
      return tableBottomY;
  }
  
}