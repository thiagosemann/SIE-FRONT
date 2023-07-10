import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Curso } from '../../utilitarios/objetoCurso';

@Injectable({
  providedIn: 'root'
})
export class DocumentJsonService {
    private editalCapacitacao = {
        documento: [
          {
            tipo:'preambulo',
            data:[
                'EDITAL {numeroProcesso}/{anoAtual}/DIE/CBMSC',
                'Código de autenticação para uso da DIE: {auth}',
                '{nomeCurso} ({sigla})'
            ]
          },
          {
            tipo:'intro',
            data:'O Tenente-Coronel BM Túlio Tartari Zanin, respondendo pela Diretoria de Instrução e Ensino do Corpo de Bombeiros Militar de Santa Catarina (CBMSC), de acordo com o Plano Geral de Ensino,torna público que no período de {periodoInscricaoExtenso}, encontram-se abertas as inscrições da seleção para o {nomeCurso} ({sigla}), a ser realizado no(a) {bbm} - {municipio}'
          },
          {
            tipo: 'capitulo',
            numero: '1',
            texto: 'Síntese',
            itens: [
              {
                tipo: 'tabela',
                content: 'left',
                hasHeader: false,
                dados: [
                  ['Nome da atividade de ensino', '{nomeCurso}'],
                  ['Coordenador da atividade de ensino', 'Dado 3'],
                  ['Contato coordenador', 'Dado 3'],
                  ['Período de inscrição', '{periodoInscricao}'],
                  ['Período da atividade de ensino', '{periodoAtividade}'],
                  ['Local de apresentação dos alunos', '{localApresentacao}'],
                  ['Data e hora de apresentação dos alunos', '{iniCur} {apresentacaoHorario}h'],
                  ['Carga horária total', '{haCurso}'],
                  ['Finalidade', '{finalidade}']
                ]
              }
            ]
          },
          {
            tipo: 'capitulo',
            numero: '2',
            texto: 'VAGAS',
            itens: [
              {
                tipo: 'item',
                numero: '2.1',
                texto: 'A distribuição das vagas não limita a quantidade de inscritos.'
              },
              {
                tipo: 'item',
                numero: '2.2',
                texto: 'É permitida a inscrição de candidatos de locais não listados no quadro de vagas e candidatos externos, sendo que estes concorrerão às vagas remanescentes.'
              },
              {
                tipo: 'item',
                numero: '2.3',
                texto: 'Caso não sejam preenchidas as vagas, estas serão redistribuídas a critério da coordenação da atividade de ensino.'
              }
            ]
          },
          {
            tipo: 'capitulo',
            numero: '3',
            texto: 'REQUISITOS',
            itens: [
              {
                tipo: 'item',
                numero: '3.1',
                texto: 'Requisitos básicos',
                subitens: [
                  {
                    tipo: 'subitem',
                    letra: 'a)',
                    texto: 'São requisitos básicos para concorrer às vagas internas ao CBMSC:',
                    subsubitens: [
                      {
                        tipo: 'subsubitem',
                        letra: '(1)',
                        texto: '{requisitosCSM}',
                      },
                      {
                        tipo: 'subsubitem',
                        letra: '(2)',
                        texto: 'Ser voluntário ou ter sido convocado.',
                      },
                    ]
                  },
                  {
                    tipo: 'subitem',
                    letra: 'b)',
                    texto: 'São requisitos básicos para concorrer às vagas externas ao CBMSC (se houver):',
                    subsubitens: [
                      {
                        tipo: 'subsubitem',
                        letra: '(1)',
                        texto: 'Apresentar documentação que comprove que esteja autorizado por seu respectivo Comando Geral ou chefia militar ou civil equivalente e competente para o ato de autorização.',
                      },
                      {
                        tipo: 'subsubitem',
                        letra: '(2)',
                        texto: 'Se militar: ',
                        subsubsubitens: [
                          {
                            tipo: 'subsubsubitem',
                            letra: '(a)',
                            texto: 'Ser da ativa. '
                          },
                          {
                            tipo: 'subsubsubitem',
                            letra: '(b)',
                            texto: 'Não estar condenado a pena de suspensão do exercício do posto, graduação, cargo ou função, prevista no Código Penal Militar. '
                          },
                          {
                            tipo: 'subsubsubitem',
                            letra: '(c)',
                            texto: 'Não estar em cumprimento de sentença condenatória transitada em julgado, com pena privativa de liberdade. '
                          },
                        ]
                      },
                    ]
                  }
                ]
              },
              {
                tipo: 'item',
                numero: '3.2',
                texto: 'Requisitos específicos',
                subitens: [
                  {
                    tipo: 'subitem',
                    letra: 'a)',
                    texto: 'São requisitos básicos para concorrer às vagas internas ao CBMSC:'
                  }
                ]
              }
            ]
          },
          {
            tipo: 'capitulo',
            numero: '4',
            texto: 'INSCRIÇÕES',
            itens: [
              {
                tipo: 'item',
                numero: '4.1',
                texto: 'As inscrições deverão ser realizadas das {insHoraInicio}h de {insDataIni} às {insHoraFim}h de {insDataFim}'
              },
              {
                tipo: 'item',
                numero: '4.2',
                texto: 'Pelas respectivas seções de instrução e ensino (B3) dos Batalhões Bombeiro Militar ou similares das Diretorias, Regiões Bombeiro Militar, Estado Maior Geral, Subcomando Geral e Comando Geral, relativo aos respectivos efetivos subordinados, por meio de nota eletrônica destinada a {insEmail}, indicando a ordem de prioridade'
              },
              {
                tipo: 'item',
                numero: '4.3',
                texto: 'Os pedidos de inscrições recebidos pelas autoridades acima citadas poderão ser indeferidos na origem, a seus respectivos e justificados critérios ou conveniência.'
              },
              {
                tipo: 'item',
                numero: '4.4',
                texto: 'A coordenadoria da atividade de ensino em questão, ao receber asnotas eletrônicas dos pedidos de inscrição oriundas das autoridades constantes no item 4.2, poderá, a seus respectivos e justificados critérios ou conveniência, indeferir determinadas inscrições'
              }
            ]
          },
          {
            tipo: 'capitulo',
            numero: '5',
            texto: 'PROCESSO SELETIVO',
            itens: [
              {
                tipo: 'item',
                numero: '5.1',
                texto: 'A divulgação do resultado do processo seletivo é de responsabilidade do coordenador da atividade de ensino e será realizado por nota eletrônica para a rede interna do CBMSC (cbmsc@cbm.sc.gov.br).'
              }
            ]
          },
          {
            tipo: 'capitulo',
            numero: '6',
            texto: 'DIVULGAÇÃO DO RESULTADO',
            itens: [
              {
                tipo: 'item',
                numero: '6.1',
                texto: 'A divulgação do resultado do processo seletivo é de responsabilidade do coordenador da atividade de ensino e será realizado por nota eletrônica para a rede interna do CBMSC (cbmsc@cbm.sc.gov.br).'
              },
              {
                tipo: 'item',
                numero: '6.2',
                texto: 'O resultado do processo seletivo será divulgado até às {procSelHora}h do dia {procSelDate}'
              }
            ]
          },
          {
            tipo: 'capitulo',
            numero: '7',
            texto: 'ATIVIDADES PRELIMINARES',
            itens: [
              {
                tipo: 'item',
                numero: '',
                texto: 'Sem atividades'
              }
            ]
          },
          {
            tipo: 'capitulo',
            numero: '8',
            texto: 'LOGÍSTICA',
            itens: [
              {
                tipo: 'item',
                numero: '8.1',
                texto: 'Diárias Militares',
                subitens: [
                    {
                      tipo: 'subitem',
                      letra: '',
                      texto: 'Não serão pagas diárias militares aos alunos e instrutores.'
                    }]
              },
              {
                tipo: 'item',
                numero: '8.2',
                texto: 'Alimentação',
                subitens: [
                  {
                    tipo: 'subitem',
                    letra: 'a)',
                    texto: 'Será fornecido alimentação (café, almoço e janta) pela OBM receptora da atividade de ensino aos alunos e instrutores, se necessário.'
                  },
                  {
                    tipo: 'subitem',
                    letra: 'b)',
                    texto: 'O aluno deverá levar para a atividade de ensino os seguintes gêneros alimentícios, os quais deverão ser fornecidos por sua OBM de origem:',
                    subsubitens:[
                        {
                            tipo: 'tabela',
                            content: 'center',
                            hasHeader: true,
                            dados: [
                                ['Material', 'Quantidade'],
                                ['Martelo', '2'],
                                ['Alicate', '4'],
                                ['Teste', '6'],
                                ['Teste', '8']
                            ]
                          }
                    ]
                  }
                ]
              },
              {
                tipo: 'item',
                numero: '8.3',
                texto: 'Hospedagem',
                subitens: [
                  {
                    tipo: 'subitem',
                    letra:'',
                    texto: 'Será fornecido hospedagem pela OBM receptora da atividade de ensino aos alunos e instrutores, se necessário.'
                  }
                ]
              },
              {
                tipo: 'item',
                numero: '8.4',
                texto: 'Diárias de Curso',
                subitens: [
                  {
                    tipo: 'subitem',
                    letra: 'a)',
                    texto: 'Serão pagas diárias de curso aos alunos que não fizerem jus à diárias militares.'
                  },
                  {
                    tipo: 'subitem',
                    letra: 'b)',
                    texto: 'Não serão pagas diárias de curso aos alunos que fizerem jus à diárias militares, visto que o pagamento cumulativo é vedado pela legislação vigente.'
                  },
                  {
                    tipo: 'subitem',
                    letra: 'c)',
                    texto: 'Não serão pagas diárias de curso para civis, visto não haver previsão legal.'
                  }
                ]
              },
              {
                tipo: 'item',
                numero: '8.5',
                texto: 'Transporte',
                subitens: [
                  {
                    tipo: 'subitem',
                    letra:'',
                    texto: 'Será disponibilizado aos alunos e instrutores transporte para os deslocamentos decorrentes da atividade de ensino.'
                  }
                ]
              },
              {
                tipo: 'item',
                numero: '8.6',
                texto: 'Uniforme',
                subitens: [
                  {
                    tipo: 'subitem',
                    letra:'',
                    texto: '5A operacional'
                  }
                ]
              },
              {
                tipo: 'item',
                numero: '8.7',
                texto: 'Materiais e quantitativos necessários',
                subitens: [
                  {
                    tipo: 'subitem',
                    letra:'a)',
                    texto: 'Materiais individuais',
                    subsubitens:[ 
                      {
                        tipo: 'tabela',
                        content: 'center',
                        hasHeader: true,
                        dados: [
                            ['Material', 'Quantidade'],
                            ['Martelo', '2'],
                            ['Alicate', '4'],
                            ['Teste', '6'],
                            ['Teste', '8']
                        ]
                      }
                    ]
                  },
                  {
                    tipo: 'subitem',
                    letra:'b)',
                    texto: 'Materiais coletivos'
                  }
                ]
              },
              {
                tipo: 'item',
                numero: '8.8',
                texto: 'As despesas de alimentação, hospedagem, transporte e diárias referente às vagas externas (se houver), correrão por conta do órgão ou entidade do aluno ou conforme definição dos mesmos.'
              }
            ]
          }
          
        ]
      };

      private planoCapacitacao = {
        documento: [
          {
            tipo:'preambulo',
            data:[
                'EDITAL {numeroProcesso}/{anoAtual}/DIE/CBMSC',
                'Código de autenticação para uso da DIE: {auth}',
                '{nomeCurso} ({sigla})'
            ]
          },
          {
            tipo:'intro',
            data:'O Tenente-Coronel BM Túlio Tartari Zanin, respondendo pela Diretoria de Instrução e Ensino do Corpo de Bombeiros Militar de Santa Catarina (CBMSC), de acordo com o Plano Geral de Ensino,torna público que no período de {periodoInscricaoExtenso}, encontram-se abertas as inscrições da seleção para o {nomeCurso} ({sigla}), a ser realizado no(a) {bbm} - {municipio}'
          },
          {
            tipo: 'capitulo',
            numero: '1',
            texto: 'Síntese',
            itens: [
              {
                tipo: 'tabela',
                content: 'left',
                hasHeader: false,
                dados: [
                  ['Nome da atividade de ensino', '{nomeCurso}'],
                  ['Coordenador da atividade de ensino', 'Dado 3'],
                  ['Contato coordenador', 'Dado 3'],
                  ['Período de inscrição', '{periodoInscricao}'],
                  ['Período da atividade de ensino', '{periodoAtividade}'],
                  ['Local de apresentação dos alunos', '{localApresentacao}'],
                  ['Data e hora de apresentação dos alunos', '{iniCur} {apresentacaoHorario}h'],
                  ['Carga horária total', '{haCurso}'],
                  ['Finalidade', '{finalidade}']
                ]
              }
            ]
          },
          {
            tipo: 'capitulo',
            numero: '2',
            texto: 'VAGAS',
            itens: [
              {
                tipo: 'item',
                numero: '2.1',
                texto: 'A distribuição das vagas não limita a quantidade de inscritos.'
              },
              {
                tipo: 'item',
                numero: '2.2',
                texto: 'É permitida a inscrição de candidatos de locais não listados no quadro de vagas e candidatos externos, sendo que estes concorrerão às vagas remanescentes.'
              },
              {
                tipo: 'item',
                numero: '2.3',
                texto: 'Caso não sejam preenchidas as vagas, estas serão redistribuídas a critério da coordenação da atividade de ensino.'
              }
            ]
          },
          {
            tipo: 'capitulo',
            numero: '3',
            texto: 'REQUISITOS',
            itens: [
              {
                tipo: 'item',
                numero: '3.1',
                texto: 'Requisitos básicos',
                subitens: [
                  {
                    tipo: 'subitem',
                    letra: 'a)',
                    texto: 'São requisitos básicos para concorrer às vagas internas ao CBMSC:',
                    subsubitens: [
                      {
                        tipo: 'subsubitem',
                        letra: '(1)',
                        texto: '{requisitosCSM}',
                      },
                      {
                        tipo: 'subsubitem',
                        letra: '(2)',
                        texto: 'Ser voluntário ou ter sido convocado.',
                      },
                    ]
                  },
                  {
                    tipo: 'subitem',
                    letra: 'b)',
                    texto: 'São requisitos básicos para concorrer às vagas externas ao CBMSC (se houver):',
                    subsubitens: [
                      {
                        tipo: 'subsubitem',
                        letra: '(1)',
                        texto: 'Apresentar documentação que comprove que esteja autorizado por seu respectivo Comando Geral ou chefia militar ou civil equivalente e competente para o ato de autorização.',
                      },
                      {
                        tipo: 'subsubitem',
                        letra: '(2)',
                        texto: 'Se militar: ',
                        subsubsubitens: [
                          {
                            tipo: 'subsubsubitem',
                            letra: '(a)',
                            texto: 'Ser da ativa. '
                          },
                          {
                            tipo: 'subsubsubitem',
                            letra: '(b)',
                            texto: 'Não estar condenado a pena de suspensão do exercício do posto, graduação, cargo ou função, prevista no Código Penal Militar. '
                          },
                          {
                            tipo: 'subsubsubitem',
                            letra: '(c)',
                            texto: 'Não estar em cumprimento de sentença condenatória transitada em julgado, com pena privativa de liberdade. '
                          },
                        ]
                      },
                    ]
                  }
                ]
              },
              {
                tipo: 'item',
                numero: '3.2',
                texto: 'Requisitos específicos',
                subitens: [
                  {
                    tipo: 'subitem',
                    letra: 'a)',
                    texto: 'São requisitos básicos para concorrer às vagas internas ao CBMSC:'
                  }
                ]
              }
            ]
          }
        ]
      };
      

  constructor() { }

  getEdital(curso: Curso, type: string): Observable<any> {
    let edital: any;
    if (type === 'Capacitacao') {
      edital = JSON.parse(JSON.stringify(this.editalCapacitacao)); // Faz uma cópia do JSON original
      this.replaceProperties(edital, curso); // Chama a função para substituir as propriedades
    }
    return of(edital); // Retorna o JSON modificado ou undefined se type não for igual a 'Capacitacao'
  }

  getPlanoDeEnsino(curso: Curso,type:string): Observable<any> {
    let plano: any;
    if (type === 'Capacitacao') {
      plano = JSON.parse(JSON.stringify(this.planoCapacitacao)); // Faz uma cópia do JSON original
      this.replaceProperties(plano, curso); // Chama a função para substituir as propriedades
    }
    return of(plano); // Retorna o JSON modificado ou undefined se type não for igual a 'Capacitacao'
  }

  private replaceProperties(objeto: any, curso: Curso) {
    for (let prop in objeto) {
      if (typeof objeto[prop] === 'string') {
        objeto[prop] = objeto[prop].replace(/{([^}]+)}/g, (match: string, p1: string) => curso[p1 as keyof Curso] || '');
      } else if (typeof objeto[prop] === 'object') {
        this.replaceProperties(objeto[prop], curso);
      }
    }
  }


  
  
  
}