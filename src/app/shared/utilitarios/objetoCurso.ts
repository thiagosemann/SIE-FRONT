import { Alimento } from "./alimento";
import { AtividadeHomologada } from "./atividadeHomologada";
import { Coordenador } from "./coordenador";
import { Subitem } from "./documentoPdf";
import { Material } from "./material";
import { Prescricao } from "./prescricao";
import { Uniforme } from "./uniforme";
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
  selectedProfessors?: User[]; // Propriedade adicionada
  requisitoComplementar?: Subitem[];
  requisitoEspecifico?:Subitem[];
  reqEspecificoBool?:boolean;
  reqComplementarBool?:boolean;
  prescricaoComplementar?: Prescricao[];
  alimentos?: Alimento[];
  uniformes?:Uniforme[];
  materialIndividual?: Material[];
  materialColetivo?: Material[];
  periodoInscricao?:string;
  periodoAtividade?:string;
  localApresentacao?:string;
  anoAtual?:string;
  atividadeHomologada?:AtividadeHomologada;
  finalidade?:string;
  sgpe?:string;
  atividadesPreliminares?:string;
  processoSeletivo?:string;
  [key: string]: any; // Assinatura de índice para aceitar propriedades adicionais

}
