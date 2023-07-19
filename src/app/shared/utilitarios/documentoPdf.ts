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
  content?:string;
  dados?:string[][];
  hasHeader?:boolean;

}

export interface Item {
  tipo:string;
  texto: string;
  numero:string;
  subitens: Subitem[];
  editando?: boolean;
  content?:string;
  dados?:string[][];
  hasHeader?:boolean;
}

export interface Subitem {
  tipo:string;
  texto: string;
  letra:string;
  subsubitens: Subsubitem[];
  editando?: boolean;
  content?:string;
  dados?:string[][];
  hasHeader?:boolean;
  isVisible?:string;

}

export interface Subsubitem {
  tipo:string;
  texto: string;
  letra:string;
  editando?: boolean;
  content?:string;
  dados?:string[][];
  hasHeader?:boolean;
  tipoTabela?:string;
  subsubsubitens: Subsubsubitem[];

}
export interface Subsubsubitem {
  tipo:string;
  texto: string;
  letra:string;
  editando?: boolean;
  content?:string;
  dados?:string[][];
  hasHeader?:boolean;
  tipoTabela?:string;
}

export interface Tabela {
  titulo: string;
  content:string;
  dados:string[][];
  hasHeader:boolean;
  tipo:string;
}