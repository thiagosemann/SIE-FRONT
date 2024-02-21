export interface Edital {
  id?: number; // O id é opcional, pois será preenchido pelo servidor ao criar o edital
  documentosCriadosId: number;
  numeroProcesso: string;
  statusAssinatura: string;
  statusPublicacao: string;
  statusNotaEletronica: string;
  statusSgpe: string;
  statusNb: string;
  statusFinalizacao: string;
  auth: string;
  sgpe: string;
  dataEntrada: string;
  sigla: string;
  localAtiMunicipio: string;
  bbm: string;
  startInscritiondate: string;
  endInscritiondate: string;
  fimCur: string;
  iniCur: string;
  vagas:number;
  pgeId:number;
  quantidadeInscritos?:number;
  pendenciasInscricoes?:string;
  pendenciasMensagem?:string;
}
