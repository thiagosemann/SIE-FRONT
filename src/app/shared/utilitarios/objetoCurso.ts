import { Coordenador } from "./coordenador";
import { Requisito } from "./requisito";
import { User } from "./user";

export interface Curso {
  id: number;
  startInscritiondate?: Date;
  startInscritionHorario?: string;
  endInscritiondate?: Date;
  endInscritionHorario?: string;
  emailInscrition?: string;
  iniCur?: Date;
  fimCur?: Date;
  apresentacaoHorario?: string;
  processoSeletivoDate?: Date;
  processoSeletivoHorario?: string;
  localAtiBairro?: string;
  localAtiRua?: string;
  localAtiNumeral?: string;
  localAtiNome?: string;
  localAtiMunicipio?: string;
  type?: string;
  coordenador?: Coordenador;
  selectedProfessors?: User[]; // Propriedade adicionada
  requisitoComplementar?: Requisito[];
}
