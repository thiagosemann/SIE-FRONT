import { AtividadeHomologada } from "./atividadeHomologada";
import { Coordenador } from "./coordenador";
import { Subitem,Item, Subsubitem } from "./documentoPdf";
import { Pge } from "./pge";
import { User } from "./user";

export interface Curso {
  id: number;
  bbm?:string;
  sigla?: string,
  nomeCurso?: string,
  haCurso?:string,
  numeroProcesso?:string,
  startInscritiondate?: string;
  startInscritionHorario?: string;
  endInscritiondate?: string;
  endInscritionHorario?: string;
  emailInscrition?: string;
  iniCur?: string;
  fimCur?: string;
  apresentacaoHorario?: string;
  processoSeletivoDate?: string;
  processoSeletivoHorario?: string;
  localAtiBairro?: string;
  localAtiRua?: string;
  localAtiNumeral?: string;
  localAtiNome?: string;
  localAtiMunicipio?: string;
  type?: string;
  coordenador?: Coordenador;
  coordenadorDescricao?:string;
  coordenadorContato?:string;
  globalProfessors?:User[];
  selectedProfessors?: User[]; 
  professoresSelecionados?:Subsubitem[]
  requisitoComplementar?: Subitem[];
  requisitoEspecifico?:Subitem[];
  reqEspecificoBool?:boolean;
  reqComplementarBool?:boolean;
  prescricaoComplementar?: Item[];
  alimentos?: Subsubitem[];
  uniformes?:Subitem[];
  materiaisIndividuais?: Subsubitem[];
  materiaisColetivos?: Subsubitem[];
  periodoInscricao?:string;
  periodoAtividade?:string;
  localApresentacao?:string;
  anoAtual?:string;
  atividadeHomologada?:AtividadeHomologada;
  finalidade?:string;
  sgpe?:string;
  atividadesPreliminares?:string;
  processoSeletivo?:Item[];
  pge?:Pge;
  [key: string]: any; // Assinatura de índice para aceitar propriedades adicionais

}
