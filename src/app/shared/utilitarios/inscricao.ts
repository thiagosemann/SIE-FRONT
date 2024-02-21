export interface Inscricao {
    id?: number;  // O '?' indica que o campo é opcional
    procNum: string;
    documentosCriadosId: number;
    userCivilId: number;
    situacao: string;
    mensagem?:string;
  }