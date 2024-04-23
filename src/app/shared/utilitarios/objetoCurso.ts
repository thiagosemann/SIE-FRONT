import { AtividadeHomologada } from "./atividadeHomologada";
import { Coordenador } from "./coordenador";
import { Discente } from "./discente";
import { Subitem,Item, Subsubitem } from "./documentoPdf";
import { Pge } from "./pge";
import { User } from "./user";
import { UserCivil } from "./userCivil";

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
  selectedProfessorsAbertura?: User[]; 
  professoresSelecionadosAbertura?:Subsubitem[]
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
  startTheoreticalExamDate?:string;
  startTheoreticalExamTime?:string;
  divulgacaoTheoreticalExamDate?:string;
  divulgacaoTheoreticalExamTime?:string;
  startPhysicalAptitudeTestDate?:string;
  startPhysicalAptitudeTestTime?:string;
  divulgacaoPhysicalAptitudeTestDate?:string;
  divulgacaoPhysicalAptitudeTestTime?:string;
  startDocumentSubmissionDate?:string;
  startDocumentSubmissionTime?:string;
  divulgacaoDocumentSubmissionDate?:string;
  divulgacaoDocumentSubmissionTime?:string;
  startFinalResultsDate?:string;
  startFinalResultsTime?:string;
  endCourseSemesterDate?:string;
  endCourseForecastDate?:string;
  endCourseForecastEndDate?:string;
  startOperationalTrainingDate?:string;
  endOperationalTrainingDate?:string;
  estagioDate?:string;
  dataAtiviAntesDoEstagio?:string;
  dataDocumentosExtenso?:string;
  deRio?:string;
  derio?:string;
  DERIO?:string;
  tafDateNatacao?:string;
  tafDateCorrida?:string;
  tafHNatacao?:string;
  tafHCorrida?:string;
  localNatacaoBairro?:string;
  localNatacaoRua?:string;
  localNatacaoNumeral?:string;
  localNatacaoNome?:string;
  localNatacaoMunicipio?:string;
  localTafNatacao?:string;
  localCorridaBairro?:string;
  localCorridaRua?:string;
  localCorridaNumeral?:string;
  localCorridaNome?:string;
  localCorridaMunicipio?:string;
  localTafCorrida?:string;
  docentesQTS?: any[];
  docentesQTSObj?: any[];
  diariaDeCursoArray?:any[];
  qtsFiles?:File[];
  discentesCivisExternos?:Discente[];
  discentesCivisBCeGVC?:Discente[];
  discentesMilitares?:Discente[];
  alunosFinalObj?:any[];
  alunosFinalArray?:any[];
  selectedDiscentesMilitaresEncerramento?:User[];
  selectedDiscentesCivisBCeGVCEncerramento?:UserCivil[];
  selectedDiscentesCivisExternoCEncerramento?:UserCivil[];
  alunosMatriculados?:number;
  alunosAprovados?:number;
  alunosReprovados?:number;
  alunosInaptos?:number;
  alunosDesistentes?:number;
  alunosExcluidos?:number;
  [key: string]: any; // Assinatura de índice para aceitar propriedades adicionais

}
