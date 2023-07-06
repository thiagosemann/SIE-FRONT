import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DocumentTextService {

  private sinteseData = [
    ['Nome da atividade de ensino', 'Dado 2'],
    ['Coordenador da atividade de ensino', ''],
    ['Período de inscrição', 'Dado 6'],
    ['Período da atividade de ensino', 'Dado 8'],
    ['Local de apresentação dos alunos', 'Dado 10'],
    ['Data e hora de apresentação dos alunos', 'Dado 12'],
    ['Carga horária total', 'Dado 14'],
    ['Finalidade', 'Dado 16']
  ];

  private vagasData = [
    ['Batalhão', 'Quantidade'],
    ['1ºBBM', '2'],
    ['2ºBBM', '4'],
    ['3ºBBM', '6'],
    ['4ºBBM', '8']
  ];

  private matIndData = [
    ['Material', 'Quantidade'],
    ['Martelo', '2'],
    ['Alicate', '4'],
    ['Teste', '6'],
    ['Teste', '8']
  ];

  private apresentacao = 'O Tenente-Coronel BM Túlio Tartari Zanin, respondendo pela Diretoria de Instrução e Ensino do Corpo de Bombeiros Militar de Santa Catarina (CBMSC), de acordo com o Plano Geral de Ensino, torna público que no período de {dataInsExtenso}, encontram-se abertas as inscrições da seleção para o {procNome} ({procSigla}), a ser realizado no(a) {procBBM} - {procMunicipio}.';

  private chapter2 = [
    '2 Vagas ',
    '2.1 A distribuição das vagas não limita a quantidade de inscritos.',
    '2.2 É permitida a inscrição de candidatos de locais não listados no quadro de vagas e candidatos externos, sendo que estes concorrerão às vagas remanescentes.',
    '2.3 Caso não sejam preenchidas as vagas, estas serão redistribuídas a critério da coordenação da atividade de ensino.'
  ];

  private chapter3 = [
    '3 REQUISITOS ',
    '3.1 Requisitos básicos',
    'a) São requisitos básicos para concorrer às vagas internas ao CBMSC:',
    '(1) {requisitosCSM}',
    '(2) Ser voluntário ou ter sido convocado.',
    '(3) Ser autorizado por seu comandante de Batalhão, de Região Bombeiro Militar, Diretor, Chefe do Estado Maior Geral, Subcomandante Geral ou Comandante Geral, aos que servirem respectivamente às suas ordens.',
    '(4) Não se encontrar em qualquer tipo de afastamento durante todo o período da atividade de ensino. ',
    '(5) Não estar condenado a pena de suspensão do exercício do posto, graduação, cargo ou função, prevista no Código Penal Militar.',
    '(6) Não estar em cumprimento de sentença condenatória transitada em julgado, com pena privativa de liberdade.',
    'b) São requisitos básicos para concorrer às vagas externas ao CBMSC (se houver):',
    '(1) Apresentar documentação que comprove que esteja autorizado por seu respectivo Comando Geral ou chefia militar ou civil equivalente e competente para o ato de autorização.',
    '(2) Se militar: ',
    '(a) Ser da ativa',
    '(b) Não estar condenado a pena de suspensão do exercício do posto, graduação, cargo ou função, prevista no Código Penal Militar.',
    '(c) Não estar em cumprimento de sentença condenatória transitada em julgado, com pena privativa de liberdade.',
    '*Vagas externas: Entende-se por vagas externas aquelas que venham a ser preenchidas por militares de outras corporações  ou por civis de entidades públicas diversas.',
    '3.2 Requisitos específicos',
    'a) São requisitos básicos para concorrer às vagas internas ao CBMSC:',
    '3.3 Requisitos específicos',
    'a) São requisitos básicos para concorrer às vagas internas ao CBMSC:',
  ];
  private chapter4 = [
    '4.1 As inscrições deverão ser realizadas das {insHoraInicio}h de {insDataIni} às {insHoraFim}h de {insDataFim} ',
    '4.2 Pelas respectivas seções de instrução e ensino (B3) dos Batalhões Bombeiro Militar ou similares das Diretorias, Regiões Bombeiro Militar, Estado Maior Geral, Subcomando Geral e Comando Geral, relativo aos respectivos efetivos subordinados, por meio de nota eletrônica destinada a {insEmail}, indicando a ordem de prioridade',
    '4.3 Os pedidos de inscrições recebidos pelas autoridades acima citadas poderão ser indeferidos na origem, a seus respectivos e justificados critérios ou conveniência.',
    '4.4 A coordenadoria da atividade de ensino em questão, ao receber as notas eletrônicas dos pedidos de inscrição oriundas das autoridades constantes no item 4.2, poderá, a seus respectivos e justificados critérios ou conveniência, indeferir determinadas inscrições'
  ];
  private chapter5 = [
    '5.1 A divulgação do resultado do processo seletivo é de responsabilidade do coordenador da atividade de ensino e será realizado por nota eletrônica para a rede interna do CBMSC (cbmsc@cbm.sc.gov.br). '
   ];
   private chapter6 = [
    '6.1 A divulgação do resultado do processo seletivo é de responsabilidade do coordenador da atividade de ensino e será realizado por nota eletrônica para a rede interna do CBMSC (cbmsc@cbm.sc.gov.br). ',
    '6.2 O resultado do processo seletivo será divulgado até às {procSelHora}h do dia {procSelDate}'
   ];
   private chapter7 = [
    'Sem atividades'
   ];
   private chapter8 = [
    '8 LOGÍSTICA',
    '8.1 Diárias Militares',
    'Não serão pagas diárias militares aos alunos e instrutores.',
    '8.2 Alimentação',
    'a) Será fornecido alimentação (café, almoço e janta)  pela OBM receptora da atividade de ensino aos alunos e instrutores, se necessário.',
    'b) O aluno deverá levar para a atividade de ensino os seguintes gêneros alimentícios, os quais deverão ser fornecidos por sua OBM de origem:',
    '8.3 Hospedagem: ',
    'Será fornecido hospedagem pela OBM receptora da atividade de ensino aos alunos e instrutores, se necessário.',
    '8.4 Diárias de Curso: ',
    'a) Serão pagas diárias de curso aos alunos que não fizerem jus à diárias militares.',
    'b) Não serão pagas diárias de curso aos alunos que fizerem jus à diárias militares, visto que o pagamento cumulativo é vedado pela legislação vigente.',
    'c) Não serão pagas diárias de curso para civis, visto não haver previsão legal.',
    '8.5 Transporte: ',
    'Será disponibilizado aos alunos e instrutores transporte para os deslocamentos decorrentes da atividade de ensino. ',
    '8.6 Uniforme:',
    '5A operacional',
    '8.7 Materiais e quantitativos necessários: ',
    'a) Materiais individuais: ',
    'b) Materiais coletivos:',
    '8.8 As despesas de alimentação, hospedagem, transporte e diárias referente às vagas externas (se houver),  correrão por conta do órgão ou entidade do aluno ou conforme definição dos mesmos.'
  ];
  private chapter9 = [
    '9.1 Ao final da atividade de ensino os alunos aprovados receberão certificado emitido pela Diretoria de Instrução e Ensino.',
    '9.2 Os esclarecimentos e dúvidas relativos à operacionalização e execução da presente atividade de ensino, deverão ser direcionados ao coordenador da atividade de ensino, conforme contato previsto no item 1 deste edital.',
    '9.3 As situações que porventura não estiverem previstas neste edital serão resolvidas pela Diretoria de Instrução e Ensino.',
  ];
  private chapter10 = [
    '10.1 Ao final da atividade de ensino os alunos aprovados receberão certificado emitido pela Diretoria de Instrução e Ensino.',
    '10.2 Os esclarecimentos e dúvidas relativos à operacionalização e execução da presente atividade de ensino, deverão ser direcionados ao coordenador da atividade de ensino, conforme contato previsto no item 1 deste edital.',
    '10.3 As situações que porventura não estiverem previstas neste edital serão resolvidas pela Diretoria de Instrução e Ensino.',
  ];
  
  // Demais constantes dos capítulos

  constructor() { }

  generateSinteseResposta(): string {
    let resposta = '';
    for (const data of this.sinteseData) {
      resposta += `${data[0]}: ${data[1]}\n`;
    }
    return resposta;
  }

  generateVagasResposta(): string {
    let resposta = '';
    for (const data of this.vagasData) {
      resposta += `${data[0]}: ${data[1]}\n`;
    }
    return resposta;
  }

  generateMatIndResposta(): string {
    let resposta = '';
    for (const data of this.matIndData) {
      resposta += `${data[0]}: ${data[1]}\n`;
    }
    return resposta;
  }

  getApresentacao(dataInsExtenso: string, procNome: string, procSigla: string, procBBM: string, procMunicipio: string): string {
    return this.apresentacao
      .replace('{dataInsExtenso}', dataInsExtenso)
      .replace('{procNome}', procNome)
      .replace('{procSigla}', procSigla)
      .replace('{procBBM}', procBBM)
      .replace('{procMunicipio}', procMunicipio);
  }

  getChapter2(): string[] {
    return this.chapter2;
  }
  getChapter3(): string[] {
    return this.chapter3;
  }
  getChapter4(): string[] {
    return this.chapter4;
  }
  getChapter5(): string[] {
    return this.chapter5;
  }
  getChapter6(): string[] {
    return this.chapter6;
  }
  getChapter7(): string[] {
    return this.chapter7;
  }
  getChapter8(): string[] {
    return this.chapter8;
  }
  getChapter9(): string[] {
    return this.chapter9;
  }
  getChapter10(): string[] {
    return this.chapter10;
  }
}
