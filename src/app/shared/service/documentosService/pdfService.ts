import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import { Curso } from '../../utilitarios/objetoCurso';
import { ComponentItem } from '../CourseConfigService';
import { PDFHelper } from './pdfServiceFileFunctions';
import { PDFUtilitarios } from './pdfServiceUtilitarios';
import { DocumentosService } from './documento.service';


@Injectable({
  providedIn: 'root'
})
export class PdfService {
  pdfHelper = new PDFHelper();
  constructor(private documentoService: DocumentosService) {}
  pdfUtil = new PDFUtilitarios(this.documentoService);

  public components: ComponentItem[] = [];

  async createDocument(curso: Curso, type: string, model:string): Promise<Blob> {
    const doc = new jsPDF();
    const responseDoc = await this.pdfUtil.getDocument(model+ type).toPromise();
    if(curso && curso.type){
      this.pdfUtil.replaceProperties(responseDoc.dados.documento, curso);

      // Alterações especificas para cada tipo de curso.
      if(curso.type==="aberturaCursoMilitar"){
        this.executeAberturaCursoMilitar(responseDoc.dados.documento, curso,model);
      }else if(curso.type==="encerramentoCursoMilitar" ){
        this.executeEncerramentoCursoMilitar(responseDoc.dados.documento, curso,model);
      }else if(curso.type==="aberturaTreinamentoMilitar" ){
        this.executeAberturaTreinamentoMilitar(responseDoc.dados.documento, curso,model);
      }else if(curso.type==="aberturaTBAE" ){
        this.executeAberturaTBAE(responseDoc.dados.documento, curso,model)
      }else if(curso.type==="aberturaTBC" ){
        this.executeAberturaTBC(responseDoc.dados.documento, curso,model)
      }else if(curso.type==="aberturaCBC" ){
        this.executeAberturaCBC(responseDoc.dados.documento, curso,model)
      }
      
      await this.pdfHelper.generateDocumento(doc, responseDoc.dados,model);
    }
    return new Promise<Blob>((resolve) => {
      const pdfBlob = doc.output('blob');
      resolve(pdfBlob);
    });
  }
  executeEncerramentoCursoMilitar(responeDoc:any , curso:Curso,model:string){
    this.manageItem4RFC(responeDoc, curso)
    this.manageDicentes(responeDoc,curso)
  }


  executeAberturaCBC(responeDoc:any , curso:Curso,model:string){
    if(model == 'plano'){
      this.manageCustos(responeDoc, curso);
    }
    this.managesubsubitens(responeDoc, curso,"ADMINISTRAÇÃO","3.2","Corpo docente","b)")
  }
  executeAberturaTBAE(responeDoc:any , curso:Curso,model:string){
    this.manageCustos(responeDoc, curso);
    this.managesubsubitens(responeDoc, curso,"ADMINISTRAÇÃO","3.2","Corpo docente","b)") 
  }
  executeAberturaTBC(responeDoc:any , curso:Curso,model:string){
    this.createFinalidadeAndTotalVagasTBC(curso);
    this.manageCustos(responeDoc, curso);
    this.managesubsubitens(responeDoc, curso,"ADMINISTRAÇÃO","3.2","Corpo docente","b)") 
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
      this.managesubsubitens(responeDoc, curso,"ADMINISTRAÇÃO","3.2","Corpo docente","b)")
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
 


  private createFinalidadeAndTotalVagasTBC(curso: Curso){
    if(curso.sigla == "TBC-I"){
      curso.finalidade = "Proporcionar e atualizar o bombeiro comunitário em conhecimentos nas áreas de salvamento e de resgate veicular, bem como, habilitá-lo à promoção ao 5º Grau (BC Sênior Classe 3). "
    }else if(curso.sigla == "TBC-I"){
      curso.finalidade = "Proporcionar e atualizar o bombeiro comunitário em conhecimentos nas áreas de combate a incêndio, atividades técnicas, brigada de incêndio, gerenciamento de riscos, técnicas de ensino e segurança contra incêndio, bem como, habilitá-lo à promoção ao 10º Grau (BC Pleno Classe 1)."
    }
    curso.totalVagas = curso.pge?.vagas;
  }
  
  private manageTBCItens(objeto: any,curso: Curso,type:string){
    const documento = objeto;
    console.log(objeto)
      if (type === "edital") {
        for (const capitulo of documento) {
            if (capitulo.tipo === "capitulo") {
                if (capitulo.texto === "VAGAS" && capitulo.itens.some((item: any) => item.numero === "2.2")) {
                    const subitens = [
                      this.pdfUtil.criarSubitem("5º Grau ou superior - BC Sênior Classe 3 ou superior (até e inclusive o 9º Grau – BC Pleno Classe 2), relativo a BC que tenha sido promovido ao 5º Grau ou a graus superiores e que não tenha realizado o TBC-I por falta de oferta do treinamento em tempo hábil à sua promoção;", "a)"),
                      this.pdfUtil.criarSubitem("4º Grau - BC Júnior Classe 1;", "b)"),
                      this.pdfUtil.criarSubitem("3º Grau - BC Júnior Classe 2;", "c)"),
                      this.pdfUtil.criarSubitem("2º Grau - BC Júnior Classe 3;", "d)"),
                      this.pdfUtil.criarSubitem("1º Grau - BC", "e)"),
                    ];
                    capitulo.itens.find((item: any) => item.numero === "2.2").subitens.push(...subitens);
                }
                if (capitulo.texto === "REQUISITOS" && capitulo.itens.some((item: any) => item.numero === "3.2")) {
                    const requisitoTexto = curso.sigla === "TBC-I" ?
                        "Ser bombeiro comunitário ativo do 4º ao 1º grau, respeitada a ordem de prioridade para o preenchimento das vagas conforme previsto neste edital." :
                        "Ter concluído com aproveitamento o Treinamento de Bombeiro Comunitário - Nível I (TBC-I).";

                    capitulo.itens.find((item: any) => item.numero === "3.2").texto = requisitoTexto;
                }
            }
        }
      } else if (type === "plano") {
        for (const capitulo of documento) {
            if (capitulo.tipo === "capitulo" && capitulo.texto === "PLANEJAMENTO") {
                for (const item of capitulo.itens) {
                    if (item.numero === "2.2" && item.subitens.some((subitem: any) => subitem.letra === 'b)')) {
                        const subitens = [
                          this.pdfUtil.criarSubSubitem("5º Grau ou superior - BC Sênior Classe 3 ou superior (até e inclusive o 9º Grau – BC Pleno Classe 2), relativo a BC que tenha sido promovido ao 5º Grau ou a graus superiores e que não tenha realizado o TBC-I por falta de oferta do treinamento em tempo hábil à sua promoção;", "(1)"),
                          this.pdfUtil.criarSubSubitem("4º Grau - BC Júnior Classe 1;", "(2)"),
                          this.pdfUtil.criarSubSubitem("3º Grau - BC Júnior Classe 2;", "(3)"),
                          this.pdfUtil.criarSubSubitem("2º Grau - BC Júnior Classe 3;", "(4)"),
                          this.pdfUtil.criarSubSubitem("1º Grau - BC", "(5)"),
                        ];
                        item.subitens.find((subitem: any) => subitem.letra === 'b)').subsubitens.push(...subitens);
                    }
                    if (item.numero === "2.4") {
                        const subitens = [
                          this.pdfUtil.criarSubitem("A atividade de ensino ocorrerá dentro período previsto no item 2.1, sendo de responsabilidade do coordenador distribuir a execução do conteúdo dentro do período previsto para a realização da atividade de ensino.", "a)"),
                          this.pdfUtil.criarSubitem("A atividade de ensino observará o PROMAPUD seguinte:", "b)"),
                        ];
                        const subsubitens = curso.sigla === "TBC-I" ? [
                          this.pdfUtil.criarSubSubitem("Introdução às técnicas de salvamento, Cabos, nós, Guarnições e equipamentos: 4 horas aulas.", "(1)"),
                          this.pdfUtil.criarSubSubitem("Salvamento Aquático e Subaquático: 4 horas aulas.", "(2)"),
                          this.pdfUtil.criarSubSubitem("Resgate de vítimas presas em ferragens (veículos): 4 horas aulas.", "(3)"),
                          this.pdfUtil.criarSubSubitem("Treinamentos Práticos e demonstrações: 6 horas aulas.", "(4)"),
                          this.pdfUtil.criarSubSubitem("Verificação Final: 2 horas aulas.", "(5)"),
                        ] : [
                          this.pdfUtil.criarSubSubitem("Combate a incêndios: 16 horas aulas.", "(1)"),
                          this.pdfUtil.criarSubSubitem("Atividades técnicas: 14 horas aulas.", "(2)"),
                          this.pdfUtil.criarSubSubitem("Brigada de incêndio: 4 horas aulas.", "(3)"),
                          this.pdfUtil.criarSubSubitem("Gerenciamento de riscos: 8 horas aulas.", "(4)"),
                          this.pdfUtil.criarSubSubitem("Técnicas de ensino: 10 horas aulas.", "(5)"),
                          this.pdfUtil.criarSubSubitem("Segurança contra incêndio: 10 horas aulas.", "(6)"),
                        ];
                        item.subitens.push(...subitens);
                        item.subitens.find((subitem: any) => subitem.letra === 'b)').subsubitens.push(...subsubitens);
                        item.subitens.push( this.pdfUtil.criarSubitem("Carga horária total: 62 horas aulas.", "c)"));
                    }
                }
            }
        }
    }
    for (const capitulo of documento) {
        if (capitulo.tipo === "capitulo" && capitulo.texto === "PRESCRIÇÕES COMPLEMENTARES") {
            if (curso.prescricaoComplementar) {
                curso.prescricaoComplementar.forEach((item: any) => {
                    item.numero = "10." + item.numero;
                });
                capitulo.itens = curso.prescricaoComplementar;
            }
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
            const subitens = [
              this.pdfUtil.criarSubitem(curso.pge?.valorPrevHA ? `Hora-aula: ${formatCurrency(Number(curso.pge.valorPrevHA))}` : 'Hora-aula: R$ 0,00', "a)"),
              this.pdfUtil.criarSubitem(curso.pge?.valorPrevDiaCurso ? `Diárias de Curso: ${formatCurrency(Number(curso.pge.valorPrevDiaCurso))}` : 'Diárias de Curso: R$ 0,00', "b)"),
              this.pdfUtil.criarSubitem(curso.pge?.valorPrevDiaMilitar ? `Diária Militar: ${formatCurrency(Number(curso.pge.valorPrevDiaMilitar))}` : 'Diária Militar: R$ 0,00', "c)"),
              this.pdfUtil.criarSubitem(curso.pge?.valorPrevAlimentacao ? `Alimentação: ${formatCurrency(Number(curso.pge.valorPrevAlimentacao))}` : 'Alimentação: R$ 0,00', "d)"),
            ];
            item.subitens.push(...subitens);
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
                subitem.subsubitens = curso.professoresSelecionadosAbertura;
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
                    letra: `${this.pdfUtil.getLetraFromIndex(item.subitens.length)})`,
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
                  letra: `${this.pdfUtil.getLetraFromIndex(item.subitens.length)})`,
                  texto: `${vagasBBMBOA} ${Number(vagasBBMBOA) === 1 ? 'vaga' : 'vagas'} para o BOA`,

                };
                item.subitens.push(subItemBOA);
              }
  
              const vagasBBMCapital = curso.pge.vagasBBMCapital;
              if (vagasBBMCapital && Number(vagasBBMCapital) > 0) {
                somaVagas += Number(vagasBBMCapital);
                const subItemCapital = {
                  tipo: "subitem",
                  letra: `${this.pdfUtil.getLetraFromIndex(item.subitens.length)})`,
                  texto: `${vagasBBMCapital} ${Number(vagasBBMCapital) === 1 ? 'vaga' : 'vagas'} para a Capital`,

                };
                item.subitens.push(subItemCapital);
              }
  
              const vagasBBMExternas = curso.pge.vagasBBMExternas;
              if (vagasBBMExternas && Number(vagasBBMExternas) > 0) {
                somaVagas += Number(vagasBBMExternas);
                const subItemExternas = {
                  tipo: "subitem",
                  letra: `${this.pdfUtil.getLetraFromIndex(item.subitens.length )})`,
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
              const subitens = [
                this.pdfUtil.criarSubitem("Serão pagas diárias militares aos alunos e instrutores que fizerem jus, conforme legislação vigente, cujo processo deve ser solicitado de forma ordinária pela OBM de origem do bombeiro militar.", "a)"),
                this.pdfUtil.criarSubitem("Em cursos com duração maior que uma semana, é possível que os alunos e instrutores lotados em municípios distantes, permaneçam durante o final de semana no município da sede do curso, recebendo as diárias militares correspondentes. Estabelece-se como parâmetro para definir “municípios distantes” uma quilometragem superior a 300 km.", "b)"),
                this.pdfUtil.criarSubitem("Tal permanência necessitará ser justificada pelo beneficiário e concedida pelo responsável pela autorização do deslocamento, conforme portaria de subdelegações de competências do CBMSC.", "c)"),
                this.pdfUtil.criarSubitem("A permanência dos alunos e instrutores na sede do curso durante o final de semana, com o recebimento de diárias militares, deverá ser fielmente observada, sendo que o seu descumprimento ensejará em medidas penais e administrativas.", "d)"),
              ];
              item.subitens.push(...subitens);
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

//--------------------------------------------------------------FUNÇOES RELATÓRIO FINAL DE CURSO-----------------------------------------------------------------------------------//
//--------------------------------------------------------------FUNÇOES RELATÓRIO FINAL DE CURSO-----------------------------------------------------------------------------------//


  private manageItem4RFC(objeto: any,curso: Curso) {
    let diariaMilitar = 0;
    let diariaDeCursoQtd = 0;
    let diariaDeCurso = 0;
    let horaAulaQtd = 0;
    let horaAulaValor = 0;
    let valorTotal = 0;
    let alimentacao = 0;
  
    // Verificando se curso.docentesQTSObj existe antes de iterar
    if (curso.docentesQTSObj) {
      curso.docentesQTSObj.forEach(docente => {
        diariaMilitar += Number(docente.diariaMilitar) || 0;
        horaAulaQtd += Number(docente.horaAulaQtd) || 0;
        horaAulaValor += Number(docente.horaAulaValor) || 0;
        alimentacao += Number(docente.alimentacao) || 0; // Corrigindo a coleta de valores para alimentação
      });
    }
  
    // Verificando se curso.alunosFinalObj existe antes de iterar
    if (curso.alunosFinalObj) {
      curso.alunosFinalObj.forEach(discente => {
        diariaMilitar += Number(discente.diariaMilitar) || 0;
        diariaDeCursoQtd += Number(discente.diariaDeCursoQtd) || 0;
        diariaDeCurso += Number(discente.diariaDeCurso) || 0;
        alimentacao += Number(discente.alimentacao) || 0; // Corrigindo a coleta de valores para alimentação
      });
    }
    console.log("alunosFinalObj",curso.alunosFinalObj)
    valorTotal = diariaMilitar + horaAulaValor + alimentacao + diariaDeCurso;
  
    const documento = objeto;
    for (const capitulo of documento) {
      if (capitulo.tipo === "capitulo") {
        for (const item of capitulo.itens) {
          if (item.numero === "4.1") {
            if(curso.docentesQTS && curso.docentesQTS.length>0){
              item.subitens[0].dados = curso.docentesQTS;
            }
          }
          if (item.numero === "4.2") {
            if(curso.diariaDeCursoArray && curso.diariaDeCursoArray.length>0){
              item.subitens[0].dados = curso.diariaDeCursoArray;
            }
          }
          if (item.numero === "4.3") {
            if (curso.docentesQTSObj && curso.docentesQTSObj.length > 0) {
              const subitens = [
                this.pdfUtil.criarSubitem(`Diária militar: ${diariaMilitar.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`, 'a)'),
                this.pdfUtil.criarSubitem(`Diária de curso: ${diariaDeCurso.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`, 'b)'),
                this.pdfUtil.criarSubitem(`Hora aula indenizável: ${horaAulaValor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`, 'c)'),
                this.pdfUtil.criarSubitem(`Alimentação:${alimentacao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`, 'd)'),
                this.pdfUtil.criarSubitem(`Total gasto nesta atividade de ensino: ${valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`, 'e)')
              ];
              item.subitens.push(...subitens);
            }
          }
        }
      }
    }
  }

  private manageDicentes(objeto: any,curso: Curso) {
    console.log(curso.alunosFinalArray)
    const militaresAux:any[]=[];
    militaresAux.push([
      "Class",
      "Posto/Grad",
      "Mtcl/Cpf",
      "Nome completo",
      "Faltas",
      "Nota",
      "Exame Final",
      "Situação"
      ])
      if(curso.alunosFinalArray){
        for(let i=0;i<curso.alunosFinalArray.length;i++){
          militaresAux.push(curso.alunosFinalArray[i])
        }
      }

      const documento = objeto;
      for (const capitulo of documento) {
        if (capitulo.tipo === "capitulo") {
          if(capitulo.numero=="3"){
            for (const item of capitulo.itens) {
                if(militaresAux.length>0){
                  item.subitens[0].dados = militaresAux;
                }
              
            }
          }
        }
      }
    }
    
}
