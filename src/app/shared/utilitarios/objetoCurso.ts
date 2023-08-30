import { AtividadeHomologada } from "./atividadeHomologada";
import { Coordenador } from "./coordenador";
import { Subitem,Item, Subsubitem } from "./documentoPdf";
import { Pge } from "./pge";
import { User } from "./user";

export interface Curso {
  id: number;
  auth?:string;
  bbm?:string;
  sigla?: string;
  nomeCurso?: string;
  haCurso?:string;
  haiCurso?:string;
  numeroProcesso?:string,
  startInscritiondate?: string;
  startInscritionHorario?: string;
  endInscritiondate?: string;
  endInscritionHorario?: string;
  emailInscrition?: string;
  linkInscrition?:string;
  divulgacaoInscritiondate?:string;
  divulgacaoInscritiondateHorario?:string;
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
  localApresentacao?:string;
  promoAtiBairro?: string;
  promoAtiRua?: string;
  promoAtiNumeral?: string;
  promoAtiNome?: string;
  promoAtiMunicipio?: string;
  promoApresentacao?:string;
  promoAtiDescricao?:string;
  type?: string;
  coordenador?: Coordenador;
  coordenadorDescricao?:string;
  coordenadorContato?:string;
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
  anoAtual?:string;
  atividadeHomologada?:AtividadeHomologada;
  finalidade?:string;
  sgpe?:string;
  atividadesPreliminares?:string;
  processoSeletivo?:Item[];
  pge?:Pge;
  licoes?:Subsubitem[];
  municipio1Civil?:string;
  municipio2Civil?:string;
  municipio3Civil?:string;
  vagasMunicipio?:string;
  facebook?:string;
  instagram?:string;
  outrosMeios?:string;
  redesSociais?:string;
  totalVagas?:string;
  [key: string]: any; // Assinatura de índice para aceitar propriedades adicionais

}
