export interface Documento {
    id?: number;
    tipo: string;
  }

  export interface DataDocumento {
    id?: number;
    documento_id: number;
    texto: string;
  }
  
  export interface Capitulo {
    id?: number;
    documento_id: number;
    numero: string;
    texto: string;
  }
  export interface Item {
    id?: number;
    capitulo_id: number;
    numero: string;
    texto: string;
  }
  export interface Subitem {
    id?: number;
    item_id: number;
    letra: string;
    texto: string;
  }
  export interface Subsubitem {
    id?: number;
    subitem_id: number;
    letra: string;
    texto: string;
  }
  export interface TabelaDados {
    id?: number;
    item_id: number;
    content: string;
    hasHeader: boolean;
  }
  export interface Dados {
    id?: number;
    tabela_dados_id: number;
    linha: number;
    coluna: number;
    valor: string;
  }
  export interface Vagas {
    id?: number;
    item_id: number;
    bbm: string;
    quantidade: number;
  }
  export interface Custos {
    id?: number;
    item_id: number;
    descricao: string;
    valor: number;
  }
  