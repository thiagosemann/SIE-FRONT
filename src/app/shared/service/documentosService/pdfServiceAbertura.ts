import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import { Curso } from '../../utilitarios/objetoCurso';
import { DocumentosService } from './documento.service';
import { Documento, Subitem, Subsubitem } from '../../utilitarios/documentoPdf';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ComponentItem, CourseConfigService } from '../CourseConfigService';


@Injectable({
  providedIn: 'root'
})
export class PdfService {
  constructor(private documentoService: DocumentosService,
               private courseConfigService: CourseConfigService
    ) {}
  public components: ComponentItem[] = [];

  async createDocument(curso: Curso, type: string, model:string): Promise<Blob> {
    const doc = new jsPDF();
    const responseDoc = await this.getDocument(model+ type).toPromise();
    if(curso && curso.type){
      this.replaceProperties(responseDoc.dados.documento, curso);
      if(curso.type==="aberturaCursoMilitar"){
        this.executeAberturaCursoMilitar(responseDoc.dados.documento, curso,model);
      }else if(curso.type==="aberturaTreinamentoMilitar" ){
        this.executeAberturaTreinamentoMilitar(responseDoc.dados.documento, curso,model);
      }else if(curso.type==="aberturaTBAE" ){
        this.executeAberturaTBAE(responseDoc.dados.documento, curso,model)
      }else if(curso.type==="aberturaTBC" ){
        this.executeAberturaTBC(responseDoc.dados.documento, curso,model)
      }else if(curso.type==="aberturaCBC" ){
        this.executeAberturaCBC(responseDoc.dados.documento, curso,model)
      }
      await this.generateDocumento(doc, responseDoc.dados);
    }
    return new Promise<Blob>((resolve) => {
      const pdfBlob = doc.output('blob');
      resolve(pdfBlob);
    });
  }

  executeAberturaCBC(responeDoc:any , curso:Curso,model:string){
    if(model == 'plano'){
      this.manageCustos(responeDoc, curso);
    }
    this.managesubsubitens(responeDoc, curso,"ADMINISTRAÇÃO","3.2","Corpo docente","b)") // DOCENTES
  }
  executeAberturaTBAE(responeDoc:any , curso:Curso,model:string){
    this.manageCustos(responeDoc, curso);
    this.managesubsubitens(responeDoc, curso,"ADMINISTRAÇÃO","3.2","Corpo docente","b)") // DOCENTES
  }
  executeAberturaTBC(responeDoc:any , curso:Curso,model:string){
    this.createFinalidadeAndTotalVagasTBC(curso);
    this.manageCustos(responeDoc, curso);
    this.managesubsubitens(responeDoc, curso,"ADMINISTRAÇÃO","3.2","Corpo docente","b)") // DOCENTES
    this.manageTBCItens(responeDoc,curso,model)
  }
  executeAberturaCursoMilitar(responeDoc:any , curso:Curso,model:string){
    this.manageProcessoSeletivo(responeDoc, curso);
    this.manageRequisitos(responeDoc, curso);
    this.manageLogistica(responeDoc, curso);
    this.managePrescricoes(responeDoc, curso, model)
    if(model == 'plano'){
      this.manageCustos(responeDoc, curso);
      this.manageVagasPlanoCapacitacao(responeDoc, curso);
      this.managesubsubitens(responeDoc, curso,"ADMINISTRAÇÃO","3.2","Corpo docente","b)") // DOCENTES
    }else{
      this.manageVagasEditalCapacitacao(responeDoc, curso);
    }
  }
  executeAberturaTreinamentoMilitar(responeDoc:any , curso:Curso,model:string){
    this.manageProcessoSeletivo(responeDoc, curso);
    this.manageLogistica(responeDoc, curso);
    this.managePrescricoes(responeDoc, curso, model)
    if(model == 'plano'){
      this.manageCustos(responeDoc, curso);
      this.manageVagasPlanoCapacitacao(responeDoc, curso);
      this.managesubsubitens(responeDoc, curso,"ADMINISTRAÇÃO","3.2","Corpo docente","b)") // DOCENTES
      this.managesubsubitens(responeDoc, curso,"PLANEJAMENTO","2.4","Calendário das atividades de ensino:","a)") // CRONOGRAMA
    }else{
      this.manageVagasEditalCapacitacao(responeDoc, curso);
    }
  }
  async edicaoDocument(data: any): Promise<Blob> {
    const doc = new jsPDF();
    await this.generateDocumento(doc, data);
    return new Promise<Blob>((resolve, reject) => {
      const pdfBlob = doc.output('blob');
      resolve(pdfBlob);
    });
  }

  getDocument(curseName:string): Observable<any> {
    return this.documentoService.getDocumentoByNome(curseName).pipe(
      map((plano: Documento) => {
        return plano; // Retorna o JSON
      })
    );
  } 

  private createFinalidadeAndTotalVagasTBC(curso: Curso){
    if(curso.sigla == "TBC-I"){
      curso.finalidade = "Proporcionar e atualizar o bombeiro comunitário em conhecimentos nas áreas de salvamento e de resgate veicular, bem como, habilitá-lo à promoção ao 5º Grau (BC Sênior Classe 3). "
    }else if(curso.sigla == "TBC-I"){
      curso.finalidade = "Proporcionar e atualizar o bombeiro comunitário em conhecimentos nas áreas de combate a incêndio, atividades técnicas, brigada de incêndio, gerenciamento de riscos, técnicas de ensino e segurança contra incêndio, bem como, habilitá-lo à promoção ao 10º Grau (BC Pleno Classe 1)."
    }
    curso.totalVagas = curso.pge?.vagasMax;
  }
  
  private manageTBCItens(objeto: any,curso: Curso,type:string){
    const documento = objeto;
    console.log(objeto)
    if(type=="edital"){
      for (const capitulo of documento) {
        if (capitulo.tipo === "capitulo" && capitulo.texto === "VAGAS" ) {
          for (const item of capitulo.itens) {
            if (item.numero === "2.2") {
              const subitemA: Subitem = {
                tipo: "subsubitem",
                texto: "5º Grau ou superior - BC Sênior Classe 3 ou superior (até e inclusive o 9º Grau – BC Pleno Classe 2), relativo a BC que tenha sido promovido ao 5º Grau ou a graus superiores e que não tenha realizado o TBC-I por falta de oferta do treinamento em tempo hábil à sua promoção;",
                letra: 'a)',
                subsubitens: []
              };
              const subitemB: Subitem = {
                tipo: "subsubitem",
                texto: "4º Grau - BC Júnior Classe 1;",
                letra: 'b)',
                subsubitens: []
              };
              const subitemC: Subitem = {
                tipo: "subsubitem",
                texto: "3º Grau - BC Júnior Classe 2;",
                letra: 'c)',
                subsubitens: []
              };
              const subitemD: Subitem = {
                tipo: "subsubitem",
                texto: "2º Grau - BC Júnior Classe 3;",
                letra: 'd)',
                subsubitens: []
              };
              const subitemE: Subitem = {
                tipo: "subsubitem",
                texto: "1º Grau - BC",
                letra: 'e)',
                subsubitens: []
              };
              item.subitens.push(subitemA);
              item.subitens.push(subitemB);
              item.subitens.push(subitemC);
              item.subitens.push(subitemD);
              item.subitens.push(subitemE);

            }
          }
        }
        if (capitulo.tipo === "capitulo" && capitulo.texto === "REQUISITOS" ) {
          for (const item of capitulo.itens) {
            if (item.numero === "3.2") {
              if(curso.sigla == "TBC-I"){
                item.texto = "Ser bombeiro comunitário ativo do 4º ao 1º grau, respeitada a ordem de prioridade para o preenchimento das vagas conforme previsto neste edital."; 
              }else if(curso.sigla == "TBC-II"){
                item.texto = "Ter concluído com aproveitamento o Treinamento de Bombeiro Comunitário - Nível I (TBC-I)."; 
              }
            }
          }
        }
      }

    }else if(type=="plano"){
      for (const capitulo of documento) {
        if (capitulo.tipo === "capitulo" && capitulo.texto === "PLANEJAMENTO" ) {
          for (const item of capitulo.itens) {
            if(item.numero ==="2.2"){
              for (const subitem of item.subitens) {
                if (subitem.letra === 'b)') {
                  const subsubitemA: Subsubitem = {
                    tipo: "subsubitem",
                    texto: "5º Grau ou superior - BC Sênior Classe 3 ou superior (até e inclusive o 9º Grau – BC Pleno Classe 2), relativo a BC que tenha sido promovido ao 5º Grau ou a graus superiores e que não tenha realizado o TBC-I por falta de oferta do treinamento em tempo hábil à sua promoção;",
                    letra: '(1)',
                    subsubsubitens: []
                  };
                  const subsubitemB: Subsubitem = {
                    tipo: "subsubitem",
                    texto: "4º Grau - BC Júnior Classe 1;",
                    letra: '(2)',
                    subsubsubitens: []
                  };
                  const subsubitemC: Subsubitem = {
                    tipo: "subsubitem",
                    texto: "3º Grau - BC Júnior Classe 2;",
                    letra: '(3)',
                    subsubsubitens: []
                  };
                  const subsubitemD: Subsubitem = {
                    tipo: "subsubitem",
                    texto: "2º Grau - BC Júnior Classe 3;",
                    letra: '(4)',
                    subsubsubitens: []
                  };
                  const subsubitemE: Subsubitem = {
                    tipo: "subsubitem",
                    texto: "1º Grau - BC",
                    letra: '(5)',
                    subsubsubitens: []
                  };
                  subitem.subsubitens.push(subsubitemA);
                  subitem.subsubitens.push(subsubitemB);
                  subitem.subsubitens.push(subsubitemC);
                  subitem.subsubitens.push(subsubitemD);
                  subitem.subsubitens.push(subsubitemE);
                }
              }
            }
            if(item.numero ==="2.4"){
              const subitemA: Subitem = {
                tipo: "subitem",
                texto: "A atividade de ensino ocorrerá dentro período previsto no item 2.1, sendo de responsabilidade do coordenador distribuir a execução do conteúdo dentro do período previsto para a realização da atividade de ensino.",
                letra: 'a)',
                subsubitens: []
              };
              const subitemB: Subitem = {
                tipo: "subitem",
                texto: "A atividade de ensino observará o PROMAPUD seguinte:",
                letra: 'b)',
                subsubitens: []
              };
              if(curso.sigla == "TBC-I"){
                const subsubitemA: Subsubitem = {
                  tipo: "subsubitem",
                  texto: "Introdução às técnicas de salvamento, Cabos, nós, Guarnições e equipamentos: 4 horas aulas.",
                  letra: '1)',
                  subsubsubitens: []
                };
                const subsubitemB: Subsubitem = {
                  tipo: "subsubitem",
                  texto: "Salvamento Aquático e Subaquático: 4 horas aulas.",
                  letra: '2)',
                  subsubsubitens: []
                };
                const subsubitemC: Subsubitem = {
                  tipo: "subsubitem",
                  texto: "Resgate de vítimas presas em ferragens (veículos): 4 horas aulas.",
                  letra: '3)',
                  subsubsubitens: []
                };
                const subsubitemD: Subsubitem = {
                  tipo: "subsubitem",
                  texto: "Treinamentos Práticos e demonstrações: 6 horas aulas.",
                  letra: '4)',
                  subsubsubitens: []
                };
                const subsubitemE: Subsubitem = {
                  tipo: "subsubitem",
                  texto: "Verificação Final: 2 horas aulas.",
                  letra: '5)',
                  subsubsubitens: []
                };
                const subitemC: Subitem = {
                  tipo: "subitem",
                  texto: "Carga horária total: 62 horas aulas.",
                  letra: 'c)',
                  subsubitens: []
                };
                item.subitens.push(subitemA);
                subitemB.subsubitens.push(subsubitemA); 
                subitemB.subsubitens.push(subsubitemB); 
                subitemB.subsubitens.push(subsubitemC); 
                subitemB.subsubitens.push(subsubitemD); 
                subitemB.subsubitens.push(subsubitemE); 
                item.subitens.push(subitemB);
                item.subitens.push(subitemC);
              }else if(curso.sigla == "TBC-II"){
                const subsubitemA: Subsubitem = {
                  tipo: "subsubitem",
                  texto: "Combate a incêndios: 16 horas aulas.",
                  letra: '1)',
                  subsubsubitens: []
                };
                const subsubitemB: Subsubitem = {
                  tipo: "subsubitem",
                  texto: "Atividades técnicas: 14 horas aulas.",
                  letra: '2)',
                  subsubsubitens: []
                };
                const subsubitemC: Subsubitem = {
                  tipo: "subsubitem",
                  texto: "Brigada de incêndio: 4 horas aulas.",
                  letra: '3)',
                  subsubsubitens: []
                };
                const subsubitemD: Subsubitem = {
                  tipo: "subsubitem",
                  texto: "Gerenciamento de riscos: 8 horas aulas.",
                  letra: '4)',
                  subsubsubitens: []
                };
                const subsubitemE: Subsubitem = {
                  tipo: "subsubitem",
                  texto: "Técnicas de ensino: 10 horas aulas.",
                  letra: '5)',
                  subsubsubitens: []
                };
                const subsubitemF: Subsubitem = {
                  tipo: "subsubitem",
                  texto: "Segurança contra incêndio: 10 horas aulas.",
                  letra: '6)',
                  subsubsubitens: []
                };
                 const subitemC: Subitem = {
                  tipo: "subitem",
                  texto: "Carga horária total: 62 horas aulas.",
                  letra: 'c)',
                  subsubitens: []
                };
                item.subitens.push(subitemA);
                subitemB.subsubitens.push(subsubitemA); 
                subitemB.subsubitens.push(subsubitemB); 
                subitemB.subsubitens.push(subsubitemC); 
                subitemB.subsubitens.push(subsubitemD); 
                subitemB.subsubitens.push(subsubitemE); 
                subitemB.subsubitens.push(subsubitemF); 
                item.subitens.push(subitemB);
                item.subitens.push(subitemC);
              }
            }
          }
        }
      }
    }



    for (const capitulo of documento) {
      if (capitulo.tipo === "capitulo" && capitulo.texto === "PRESCRIÇÕES COMPLEMENTARES" ) {
        if(curso.prescricaoComplementar){
          for (const item of curso.prescricaoComplementar) {
            item.numero = "10." + item.numero
          }
        }
        capitulo.itens = curso.prescricaoComplementar
      }
    }

  }
  private manageCustos(objeto: any, curso: Curso) {
    const documento = objeto;
    const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  
    for (const capitulo of documento) {
      if (capitulo.tipo === "capitulo" && capitulo.texto === "PLANEJAMENTO") {
        for (const item of capitulo.itens) {
          if (item.numero === "2.3" && item.texto === "Previsão dos custos de indenização de ensino:") {
            const subitemA: Subitem = {
              tipo: "subsubitem",
              texto: curso.pge?.valorPrevHA ? `Hora-aula: ${formatCurrency(Number(curso.pge.valorPrevHA))}` : 'Hora-aula: R$ 0,00',
              letra: 'a)',
              subsubitens: []
            };
            const subitemB: Subitem = {
              tipo: "subsubitem",
              texto: curso.pge?.valorPrevDiaCurso ? `Diárias de Curso: ${formatCurrency(Number(curso.pge.valorPrevDiaCurso))}` : 'Diárias de Curso: R$ 0,00',
              letra: 'b)',
              subsubitens: []
            };
            const subitemC: Subitem = {
              tipo: "subsubitem",
              texto: curso.pge?.valorPrevDiaMilitar ? `Diária Militar: ${formatCurrency(Number(curso.pge.valorPrevDiaMilitar))}` : 'Diária Militar: R$ 0,00',
              letra: 'c)',
              subsubitens: []
            };
            const subitemD: Subitem = {
              tipo: "subsubitem",
              texto: curso.pge?.valorPrevAlimentacao ? `Alimentação: ${formatCurrency(Number(curso.pge.valorPrevAlimentacao))}` : 'Alimentação: R$ 0,00',
              letra: 'd)',
              subsubitens: []
            };
            item.subitens.push(subitemA);
            item.subitens.push(subitemB);
            item.subitens.push(subitemC);
            item.subitens.push(subitemD);
          }
        }
      }
    }
  }
  
  private managesubsubitens(objeto: any,curso: Curso, textoCapitulo:string,itemNumero:string,itemTexto:string,subItemLetra:string){
    const documento = objeto;
    for (const capitulo of documento) {
      if (capitulo.tipo === "capitulo" && capitulo.texto === textoCapitulo ) {
        for (const item of capitulo.itens) {
          if (item.numero === itemNumero && item.texto === itemTexto ) {
            for (const subitem of item.subitens) {
              if (subitem.letra === subItemLetra ) {
                subitem.subsubitens = curso.professoresSelecionados;
              }
            }
          }
        }
      }
    }
  }

  private managePrescricoes(objeto: any,curso: Curso,type:string) {
    const documento = objeto;
    for (const capitulo of documento) {
      if (capitulo.tipo === "capitulo" && capitulo.texto === "PRESCRIÇÕES COMPLEMENTARES" ) {
        if(curso.prescricaoComplementar){
          if(type=="edital"){
            for (const item of curso.prescricaoComplementar) {
              item.numero = "10." + item.numero
            }
          }
          if(type=="plano"){
            for (const item of curso.prescricaoComplementar) {
              item.numero = "9." + item.numero
            }
          }
        }
        capitulo.itens = curso.prescricaoComplementar
      }
    }
  }
  private manageVagasEditalCapacitacao(objeto: any, curso: Curso){
    const documento = objeto;
    let somaVagas = 0;

    for (const capitulo of documento) {
      if (capitulo.texto === 'VAGAS') {
        for (const item of capitulo.itens) {
          if (item.numero === '2.1') {
            if (curso.pge) {
              for (let i = 1; i <= 15; i++) {
                const vagasBBMProperty = `vagasBBM${i}`;
                const vagasBBMValue = curso.pge[vagasBBMProperty];
                if (vagasBBMValue && Number(vagasBBMValue) > 0) {
                  somaVagas += Number(vagasBBMValue);
                  const subItem = {
                    tipo:"subitem",
                    letra: `${this.getLetraFromIndex(item.subitens.length)})`,
                    texto: `${vagasBBMValue} ${Number(vagasBBMValue) === 1 ? 'vaga' : 'vagas'} para o ${i}ºBBM`,
                  };
                  item.subitens.push(subItem);
                }
              }
  
              const vagasBBMBOA = curso.pge.vagasBBMBOA;
              if (vagasBBMBOA && Number(vagasBBMBOA) > 0) {
                somaVagas += Number(vagasBBMBOA);
                const subItemBOA = {
                  tipo: "subitem",
                  letra: `${this.getLetraFromIndex(item.subitens.length)})`,
                  texto: `${vagasBBMBOA} ${Number(vagasBBMBOA) === 1 ? 'vaga' : 'vagas'} para o BOA`,

                };
                item.subitens.push(subItemBOA);
              }
  
              const vagasBBMCapital = curso.pge.vagasBBMCapital;
              if (vagasBBMCapital && Number(vagasBBMCapital) > 0) {
                somaVagas += Number(vagasBBMCapital);
                const subItemCapital = {
                  tipo: "subitem",
                  letra: `${this.getLetraFromIndex(item.subitens.length)})`,
                  texto: `${vagasBBMCapital} ${Number(vagasBBMCapital) === 1 ? 'vaga' : 'vagas'} para a Capital`,

                };
                item.subitens.push(subItemCapital);
              }
  
              const vagasBBMExternas = curso.pge.vagasBBMExternas;
              if (vagasBBMExternas && Number(vagasBBMExternas) > 0) {
                somaVagas += Number(vagasBBMExternas);
                const subItemExternas = {
                  tipo: "subitem",
                  letra: `${this.getLetraFromIndex(item.subitens.length )})`,
                  texto: `${vagasBBMExternas} ${Number(vagasBBMExternas) === 1 ? 'vaga externa' : 'vagas externas'}`,

                };
                item.subitens.push(subItemExternas);

              }
              item.texto = `A atividade de ensino tem previsto um total de ${somaVagas} vagas, as quais estão distribuídas da seguinte forma:`;
            }
          }
        }
      }
    }
  }
  
  private manageVagasPlanoCapacitacao(objeto: any, curso: Curso){
    const documento = objeto;
    let somaVagas = 0;

    for (const capitulo of documento) {
      if (capitulo.texto === 'PLANEJAMENTO') {
        for (const item of capitulo.itens) {
          if (item.numero === '2.2') {
            for (const subitem of item.subitens) {
              if (subitem.letra === 'a)') {
                if (curso.pge) {
                  for (let i = 1; i <= 15; i++) {
                    const vagasBBMProperty = `vagasBBM${i}`;
                    const vagasBBMValue = curso.pge[vagasBBMProperty];
                    if (vagasBBMValue && Number(vagasBBMValue) > 0) {
                      somaVagas += Number(vagasBBMValue);
                      const subItem = {
                        tipo:"subsubitem",
                        letra: `(${subitem.subsubitens.length+1})`,
                        texto: `${vagasBBMValue} ${Number(vagasBBMValue) === 1 ? 'vaga' : 'vagas'} para o ${i}ºBBM`,
                      };
                      subitem.subsubitens.push(subItem);
                    }
                  }
      
                  const vagasBBMBOA = curso.pge.vagasBBMBOA;
                  if (vagasBBMBOA && Number(vagasBBMBOA) > 0) {
                    somaVagas += Number(vagasBBMBOA);
                    const subItemBOA = {
                      tipo: "subsubitem",
                      letra: `(${subitem.subsubitens.length+1})`,
                      texto: `${vagasBBMBOA} ${Number(vagasBBMBOA) === 1 ? 'vaga' : 'vagas'} para o BOA`,
    
                    };
                    subitem.subsubitens.push(subItemBOA);
                  }
      
                  const vagasBBMCapital = curso.pge.vagasBBMCapital;
                  if (vagasBBMCapital && Number(vagasBBMCapital) > 0) {
                    somaVagas += Number(vagasBBMCapital);
                    const subItemCapital = {
                      tipo: "subsubitem",
                      letra: `(${subitem.subsubitens.length+1})`,
                      texto: `${vagasBBMCapital} ${Number(vagasBBMCapital) === 1 ? 'vaga' : 'vagas'} para a Capital`,
    
                    };
                    subitem.subsubitens.push(subItemCapital);
                  }
      
                  const vagasBBMExternas = curso.pge.vagasBBMExternas;
                  if (vagasBBMExternas && Number(vagasBBMExternas) > 0) {
                    somaVagas += Number(vagasBBMExternas);
                    const subItemExternas = {
                      tipo: "subsubitem",
                      letra: `(${subitem.subsubitens.length+1})`,
                      texto: `${vagasBBMExternas} ${Number(vagasBBMExternas) === 1 ? 'vaga externa' : 'vagas externas'}`,
    
                    };
                    subitem.subsubitens.push(subItemExternas);
    
                  }
                  subitem.texto = `A atividade de ensino tem previsto um total de ${somaVagas} vagas, as quais estão distribuídas da seguinte forma:`;
                }
              
              }
            }
          }
        }
      }
    }
  }


  private getLetraFromIndex(index: number): string {
    const baseCharCode = "a".charCodeAt(0);
    const numLetters = 26; // Número de letras no alfabeto
  
    const letterIndex = index % numLetters;
    const letter = String.fromCharCode(baseCharCode + letterIndex);
  
    return letter;
  }

  private manageLogistica(objeto: any, curso: Curso) {
    const documento = objeto;
    for (const capitulo of documento) {
      if (capitulo.texto === "LOGÍSTICA") {
        // Gerenciamento do item "Alimentação"
        for (const item of capitulo.itens) {
          if(curso.pge?.valorPrevDiaMilitar != ""){
            // Com diária militar
            if (item.texto === "Diárias Militares") {
              item.subitens = [];
            
              let subItemA = {
                tipo: "subitem",
                letra: "a)",
                texto: "Serão pagas diárias militares aos alunos e instrutores que fizerem jus, conforme legislação vigente, cujo processo deve ser solicitado de forma ordinária pela OBM de origem do bombeiro militar."
              };
              item.subitens.push(subItemA);
            
              let subItemB = {
                tipo: "subitem",
                letra: "b)",
                texto: "Em cursos com duração maior que uma semana, é possível que os alunos e instrutores lotados em municípios distantes, permaneçam durante o final de semana no município da sede do curso, recebendo as diárias militares correspondentes. Estabelece-se como parâmetro para definir “municípios distantes” uma quilometragem superior a 300 km."
              };
              item.subitens.push(subItemB);
            
              let subItemC = {
                tipo: "subitem",
                letra: "c)",
                texto: "Tal permanência necessitará ser justificada pelo beneficiário e concedida pelo responsável pela autorização do deslocamento, conforme portaria de subdelegações de competências do CBMSC."
              };
              item.subitens.push(subItemC);
            
              let subItemD = {
                tipo: "subitem",
                letra: "d)",
                texto: "A permanência dos alunos e instrutores na sede do curso durante o final de semana, com o recebimento de diárias militares, deverá ser fielmente observada, sendo que o seu descumprimento ensejará em medidas penais e administrativas."
              };
              item.subitens.push(subItemD);
            }
            
            if (item.texto === "Alimentação") {
              for (const subItem of item.subitens) {       
                if (subItem.texto === "Será fornecido alimentação (café, almoço e janta)  pela OBM receptora da atividade de ensino aos alunos e instrutores, se necessário.") {
                  subItem.texto = "Será fornecido alimentação (café, almoço e janta)  pela OBM receptora da atividade de ensino, se necessário, aos alunos e instrutores que não fizerem jus à diárias militares, conforme legislação vigente.";
                }
                if (subItem.texto === "O aluno deverá levar para a atividade de ensino os seguintes gêneros alimentícios, os quais deverão ser fornecidos por sua OBM de origem:") {
                  subItem.texto = "Poderá ser fornecido alimentação (café, almoço e janta)  pela OBM receptora da atividade de ensino, se disponível, aos alunos e instrutores que fizerem jus a diárias militares, desde que não haja o oferecimento concomitante de hospedagem.";
                }
              }
            }

          }else{
            // Sem diária miltiar

            if (item.texto === "Alimentação") {
              for (const subItem of item.subitens) {       
                  if (curso.alimentos && curso.alimentos.length > 0) {
                    // Se houver alimentos definidos para o curso, substitua o conteúdo do subitem com esses alimentos
                    if (subItem.texto === "O aluno deverá levar para a atividade de ensino os seguintes gêneros alimentícios, os quais deverão ser fornecidos por sua OBM de origem:") {
                      subItem.subsubitens = curso.alimentos;
                    }
                  } else {
                    // Caso não haja alimentos definidos para o curso, exclua o subitem
                    if (subItem.texto === "Será fornecido alimentação (café, almoço e janta) pela OBM receptora da atividade de ensino aos alunos e instrutores, se necessário.") {
                      subItem.letra = "";
                    }
                    if(subItem.texto === "O aluno deverá levar para a atividade de ensino os seguintes gêneros alimentícios, os quais deverão ser fornecidos por sua OBM de origem:") {
                      const index = item.subitens.indexOf(subItem);
                      if (index !== -1) {
                        item.subitens.splice(index, 1);
                      }
                    }
                  }
                
              }
            }
            // Gerenciamento do item "Transporte"
            if (item.texto === "Transporte") {
              // Verifica se o curso tem a sigla "CBTR" ou "CIAD"
              if (curso.sigla === "CBTR" || curso.sigla === "CIAD") {
                // Se for uma dessas siglas, atualiza o texto do primeiro subitem
                item.subitens[0].texto = "Será fornecido hospedagem pela OBM receptora da atividade de ensino, se necessário, aos alunos e instrutores que não fizerem jus à diárias militares, conforme legislação vigente.";
              } else {
                // Caso contrário, atualiza o texto do primeiro subitem com um conteúdo adicional
                item.subitens[0].texto = "Será fornecido hospedagem pela OBM receptora da atividade de ensino, se necessário, aos alunos e instrutores que não fizerem jus à diárias militares, conforme legislação vigente.\nb) Poderá ser fornecido hospedagem pela OBM receptora da atividade de ensino, se disponível, aos alunos e instrutores que fizerem jus a diárias militares, desde que não haja o oferecimento concomitante de alimentação.";
              }
            }
    
            // Gerenciamento do item "Materiais e quantitativos necessários"
            if (item.texto === "Materiais e quantitativos necessários") {
              for (const subItem of item.subitens) {
                if (subItem.texto === "Materiais individuais") {
                  // Substitui os materiais individuais do subitem pelos materiais definidos no curso
                  subItem.subsubitens = curso.materiaisIndividuais;
                }
                if (subItem.texto === "Materiais coletivos") {
                  // Substitui os materiais coletivos do subitem pelos materiais definidos no curso
                  subItem.subsubitens = curso.materiaisColetivos;
                }
              }
            }
    
            // Gerenciamento do item "Uniforme"
            if (item.texto === "Uniforme") {
              // Substitui os uniformes do item pelos uniformes definidos no curso
              item.subitens = curso.uniformes;
            }
          }
        }
      }
    }
  }
  

  private manageProcessoSeletivo(objeto: any,curso: Curso){
    const documento = objeto;

    for (const capitulo of documento) {
      if (capitulo.texto === "PROCESSO SELETIVO") {
        if(curso.processoSeletivo){
          capitulo.itens = curso.processoSeletivo
        }
      }
    }
  }

  private manageRequisitos(objeto: any,curso: Curso) {
    const documento = objeto;

    for (const capitulo of documento) {
      if (capitulo.tipo === "capitulo") {
        for (const item of capitulo.itens) {
          if (item.texto === "Requisitos específicos") {
            if(curso.requisitoEspecifico && curso.requisitoEspecifico.length>0){
              item.subitens = curso.requisitoEspecifico;
            }else{
              item.subitens = [{
                tipo:"subitem",
                letra: "",
                texto: "Não possui requisitos específicos",
                subsubitens: []
              }];
            }
          }
          if (item.texto === "Requisitos complementares") {
            item.subitens = curso.requisitoComplementar;
          }
        }
      }
    }
  }

  private replaceProperties(objeto: any, curso: Curso) {
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
  
  private replacePropertiesInString(str: string, curso: Curso): string {
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
    str = str.replace('{coordPG}', curso.coordenador?.graduacao!);
    str = str.replace("{coordMtcl}", curso.coordenador?.mtcl!);
    str = str.replace("{coordNome}", curso.coordenador?.nomeCompleto!);

    return str;
  }
//--------------------------------------------------------------FUNÇOES PARA CRIAÇÃO DO DOCUMENTO-----------------------------------------------------------------------------------//
//--------------------------------------------------------------FUNÇOES PARA CRIAÇÃO DO DOCUMENTO--------------------------------------------------------------------------------//

private async generateDocumento(doc: jsPDF, editalCapacitacao: any) {
  const capituloTitleFontSize = 11;
  const lineHeight = 6;
  let positionY = 7;

  positionY = await this.addHeader(doc, positionY, lineHeight);

  for (const capitulo of editalCapacitacao.documento) {
      switch (capitulo.tipo) {
        case "preambulo":
          positionY = this.addPreamble(doc, positionY, lineHeight, capitulo.data);
          break;
        case "intro":
          positionY = this.addIntro(doc, positionY, lineHeight, capitulo.texto);
          break;
        case "capitulo":
          positionY = this.createChapter(doc,capitulo.texto,capitulo.numero,positionY,lineHeight);
          if (capitulo.itens && capitulo.itens.length > 0) {
            positionY = await this.processItens(doc, capitulo.itens, positionY, lineHeight);
          }
          break;
      }
  }
}

private async processItens(doc: jsPDF, itens: any[], positionY: number, lineHeight: number) {
  for (const item of itens) {
      if (item.tipo === "tabela") {
        positionY = this.createTable(doc,positionY,item.dados,item.hasHeader,item.content,lineHeight);
      } else {
        positionY = this.createText(doc,item.texto,item.numero,positionY,lineHeight,170,25);

        if (item.subitens && item.subitens.length > 0) {
          positionY = await this.processSubItens(doc, item.subitens, positionY, lineHeight);
        }
      }
  }

  return positionY;
}

private async processSubItens(doc: jsPDF, subitens: any[], positionY: number, lineHeight: number) {
  for (const subitem of subitens) {
      if (subitem.tipo === "tabela") {
        positionY = this.createTable(doc,positionY,subitem.dados,subitem.hasHeader,subitem.content,lineHeight);
      } else {
        positionY = this.createText(doc,subitem.texto,subitem.letra,positionY,lineHeight,170,25);
        if (subitem.subsubitens && subitem.subsubitens.length > 0) {
          positionY = await this.processSubSubItens(doc, subitem.subsubitens, positionY, lineHeight);
        }
      }
  }

  return positionY;
}

private async processSubSubItens(doc: jsPDF, subsubitens: any[], positionY: number, lineHeight: number) {
  for (const subsubitem of subsubitens) {
      if (subsubitem.tipo === "tabela") {
        positionY = this.createTable(doc,positionY,subsubitem.dados,subsubitem.hasHeader,subsubitem.content,lineHeight);
      } else {
        positionY = this.createText(doc,subsubitem.texto,subsubitem.letra,positionY,lineHeight,170,30);

        if (subsubitem.subsubsubitens && subsubitem.subsubsubitens.length > 0) {
          positionY = await this.processSubSubSubItens(doc, subsubitem.subsubsubitens, positionY, lineHeight);
        }
      }
  }

  return positionY;
}

private async processSubSubSubItens(doc: jsPDF, subsubsubitens: any[], positionY: number, lineHeight: number) {
  for (const subsubsubitem of subsubsubitens) {
      if (subsubsubitem.tipo === "tabela") {
        positionY = this.createTable(doc,positionY,subsubsubitem.dados,subsubsubitem.hasHeader,subsubsubitem.content,lineHeight);
      } else {
        positionY = this.createText(doc,subsubsubitem.texto,subsubsubitem.letra,positionY,lineHeight,155,45);
      }
  }

  return positionY;
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
    const columnWidth = 81;
    const rowHeight = 9; // Altura inicial da linha
    const borderWidth = 0.2;
    const borderColor = 'black';
    const headerFontStyle = 'bold';
    const cellPaddingTop = 2; // Espaçamento superior da célula
    const pageHeight = doc.internal.pageSize.getHeight();

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
  
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
  
  
}
