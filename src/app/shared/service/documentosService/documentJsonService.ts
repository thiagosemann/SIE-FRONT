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
          this.replaceProperties(plano, curso); // Chama a função para substituir as propriedades
          return plano; // Retorna o JSON modificado
        })
      );
  }
  

  private replaceProperties(objeto: any, curso: Curso) {
    for (let prop in objeto) {
      if (objeto.hasOwnProperty(prop)) {
        if (typeof objeto[prop] === 'string' && objeto[prop].trim() !== '') {
          objeto[prop] = objeto[prop].replace(/{([^}]+)}/g, (match: string, p1: string) => curso[p1 as keyof Curso] || '');
        } else if (typeof objeto[prop] === 'object' && objeto[prop] !== null && !Array.isArray(objeto[prop])) {
          this.replaceProperties(objeto[prop], curso);
        }
      }
    }
  }


  
  
  
}