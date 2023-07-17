import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Curso } from '../../utilitarios/objetoCurso';
import { DocumentosService } from './documento.service';
import { Documento } from '../../utilitarios/documentoPdf';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DocumentJsonService {
     

  constructor(private documentoService:DocumentosService) { }

 getDocument(curso: Curso, type: string,curseName:string): Observable<any> {
      return this.documentoService.getDocumentoByNome(type+curseName).pipe(
        map((plano: Documento) => {
          this.replaceProperties(plano.dados.documento, curso); // Chama a função para substituir as propriedades
          return plano; // Retorna o JSON modificado
        })
      );
  }
  
  private replaceProperties(objeto: any, curso: Curso) {
    const percorrerElementos = (elementos: any[]) => {
      for (let i = 0; i < elementos.length; i++) {
        const elemento = elementos[i];
        if (elemento.texto) {
          for (const prop in curso) {
            if (elemento.texto.includes(`{${prop}}`)) {
              elemento.texto = elemento.texto.replace(`{${prop}}`, curso[prop]);
            }
          }
        } else if (elemento.data) {
          for (const index in elemento.data) {
            for (const prop in curso) {
              if (elemento.data[index].includes(`{${prop}}`)) {
                elemento.data[index] = elemento.data[index].replace(`{${prop}}`, curso[prop]);
              }
            }
          }
        } else if (elemento.dados) {
          const dados = elemento.dados;
          for (const prop in curso) {
            for (let i = 0; i < dados.length; i++) {
              for (let j = 0; j < dados[i].length; j++) {
                const elemento = dados[i][j];
                if (elemento.includes(`{${prop}}`)) {
                  dados[i][j] = elemento.replace(`{${prop}}`, curso[prop]);
                }
              }
            }
          }
        } 
         
        if (elemento.itens) {
          percorrerElementos(elemento.itens);
        }
  
        if (elemento.subitens) {
          percorrerElementos(elemento.subitens);
        }
  
        if (elemento.subsubitens) {
          percorrerElementos(elemento.subsubitens);
        }
  
        if (elemento.subsubsubitens) {
          percorrerElementos(elemento.subsubsubitens);
        }
      }
    };
  
    percorrerElementos(objeto);
  }
  


  
  
  
}