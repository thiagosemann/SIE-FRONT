import { Alimento } from "./alimento";
import { Coordenador } from "./coordenador";
import { Material } from "./material";
import { Prescricao } from "./prescricao";
import { Requisito } from "./requisito";
import { Uniforme } from "./uniforme";
import { User } from "./user";

export interface Curso {
  id: number;
  bbm?:string;
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
  prescricaoComplementar?: Prescricao[];
  alimentos?: Alimento[];
  uniformes?:Uniforme[];
  materialIndividual?: Material[];
  materialColetivo?: Material[];
}
