export interface Documento {
  id: number;
  nome: string;
  dados: {
    documento: any[]; // Altere o tipo do array conforme necessário
  };
}

export interface Capitulo {
  texto: string;
  itens: Item[];
  tipo:string;
  numero:string;
  editando?: boolean;

}

export interface Item {
  tipo:string;
  texto: string;
  numero:string;
  subitens: Subitem[];
  editando?: boolean;

}

export interface Subitem {
  tipo:string;
  texto: string;
  letra:string;
  subsubitens: Subsubitem[];
  editando?: boolean;

}

export interface Subsubitem {
  tipo:string;
  texto: string;
  letra:string;
  tabelas: Tabela[];
  editando?: boolean;

}

export interface Tabela {
  titulo: string;
  // Adicione aqui as propriedades necessárias para a tabela
}