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

      organizarArrayAlunos(alunos:any[]): void {
        // Ordenar alunos
        alunos.sort((a, b) => {
          // Primeiro critério de ordenação: alunos excluídos ou desistentes ficam por último
          if (a.excluido || a.desistente) {
            return 1; // a é considerado maior
          } else if (b.excluido || b.desistente) {
            return -1; // b é considerado maior
          }
      
          // Segundo critério de ordenação: alunos aprovados ficam primeiro
          if (a.situacao === "Aprovado" && b.situacao !== "Aprovado") {
            return -1; // a é considerado menor
          } else if (a.situacao !== "Aprovado" && b.situacao === "Aprovado") {
            return 1; // b é considerado menor
          }
      
          // Terceiro critério de ordenação: alunos com maior a.nota ficam primeiro entre aprovados
          if (a.situacao === "Aprovado" && b.situacao === "Aprovado") {
            if (a.nota !== b.nota) {
              return b.nota - a.nota; // ordem decrescente por nota
            } else {
              return b.pesoGraduacao - a.pesoGraduacao; // ordem decrescente por pesoGraduacao
            }
          }
      
          // Quarto critério de ordenação: alunos com maior a.nota ficam primeiro entre reprovados por nota
          if (a.situacao.includes("Reprovado") && b.situacao.includes("Reprovado")) {
            if (a.nota !== b.nota) {
              return b.nota - a.nota; // ordem decrescente por nota
            } else {
              return b.pesoGraduacao - a.pesoGraduacao; // ordem decrescente por pesoGraduacao
            }
          }
      
          // Quinto critério de ordenação: alunos reprovados por falta são ordenados pelo pesoGraduacao
          if (a.situacao === "Reprovado por falta" && b.situacao === "Reprovado por falta") {
            return b.pesoGraduacao - a.pesoGraduacao; // ordem decrescente por pesoGraduacao
          }
      
          // Sexto critério de ordenação: alunos excluídos são ordenados pelo pesoGraduacao
          if (a.excluido && b.excluido) {
            return b.pesoGraduacao - a.pesoGraduacao; // ordem decrescente por pesoGraduacao
          }
      
          // Sétimo critério de ordenação: alunos desistentes são ordenados pelo pesoGraduacao
          if (a.desistente && b.desistente) {
            return b.pesoGraduacao - a.pesoGraduacao; // ordem decrescente por pesoGraduacao
          }
      
          return 0; // a e b são considerados iguais
        });
    
          // Definir classificação para cada aluno
        alunos.forEach((aluno, index) => {
          aluno.classificacao = index + 1;
        });
    
      }
}