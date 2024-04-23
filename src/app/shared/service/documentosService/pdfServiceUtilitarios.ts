import { Observable } from "rxjs";
import { Documento, Subitem, Subsubitem } from "../../utilitarios/documentoPdf";
import { DocumentosService } from "./documento.service";
import { map } from 'rxjs/operators';
import { Curso } from "../../utilitarios/objetoCurso";

export class PDFUtilitarios {

    constructor(private documentoService: DocumentosService) {}
    
    criarSubitem = (texto: string, letra: string): Subitem => ({
            tipo: "subitem",
            texto,
            letra,
            subsubitens: [],
    });
    criarSubSubitem = ( texto: string, letra: string): Subsubitem => ({
        tipo: "subsubitem",
        texto,
        letra,
        subsubsubitens: [],
    });

        
    getDocument(curseName:string): Observable<any> {
        return this.documentoService.getDocumentoByNome(curseName).pipe(
            map((plano: Documento) => {
            return plano; // Retorna o JSON
            })
        );
    } 
    replaceProperties(objeto: any, curso: Curso) {
        const percorrerElementos = (elementos: any[]) => {
          for (let i = 0; i < elementos.length; i++) {
            const elemento = elementos[i];
      
            if (elemento.texto) {
              elemento.texto = this.replacePropertiesInString(elemento.texto, curso);
            } else if (elemento.data) {
              for (const index in elemento.data) {
                elemento.data[index] = this.replacePropertiesInString(elemento.data[index], curso);
              }
            } else if (elemento.dados) {
              const dados = elemento.dados;
              for (let i = 0; i < dados.length; i++) {
                for (let j = 0; j < dados[i].length; j++) {
                  dados[i][j] = this.replacePropertiesInString(dados[i][j], curso);
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
      
      replacePropertiesInString(str: string, curso: Curso): string {
        // Replace {requisitosCSM} with a specific text based on the course's sigla
        const siglaPlaceholder = "{requisitosCSM}";
        if (str.includes(siglaPlaceholder)) {
          // Replace {requisitosCSM} with a specific text based on the course's sigla
          let specificText = "";
          if(curso.sigla == "CSM"){
            specificText = "Ser bombeiro militar da ativa, guarda vida civil voluntário ou guarda vida civil voluntário de rio, ambos com certificação válida."
          }else{
            specificText = "Ser bombeiro militar da ativa, bombeiro comunitário (BC) ou bombeiro civil profissional (BCP) do Estado de Santa Catarina devidamente ativos e vinculados ao CBMSC."
          }
          
          str = str.replace(siglaPlaceholder, specificText);
        }
      
        // Replace other placeholders based on the course object properties
        for (const prop in curso) {
          const placeholder = `{${prop}}`;
          if (str.includes(placeholder)) {
            str = str.replace(placeholder, curso[prop]);
          }
        }
        str = str.replace('{deRio}', curso.deRio!);
        str = str.replace('{DERIO}', curso.DERIO!);
        str = str.replace('{derio}', curso.derio!);
        str = str.replace('{coordPG}', curso.coordenador?.graduacao?.toString()!);
        str = str.replace("{coordMtcl}", curso.coordenador?.mtcl!);
        str = str.replace("{coordNome}", curso.coordenador?.nomeCompleto!);
    
        return str;
      }

      getLetraFromIndex(index: number): string {
        const baseCharCode = "a".charCodeAt(0);
        const numLetters = 26; // Número de letras no alfabeto
      
        const letterIndex = index % numLetters;
        const letter = String.fromCharCode(baseCharCode + letterIndex);
      
        return letter;
      }
}