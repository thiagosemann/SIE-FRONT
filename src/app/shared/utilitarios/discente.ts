export interface Discente {
    id?: number; 
    classificacao?:number; 
    user_id?:number;
    userCivil_id?:number;
    name?:string;
    cpf?:string;
    mtcl?:string;
    escolaridade_id?:number; //vincular com o id da tabela escolaridade
    graduacao_id?:number; //vincular com o id da tabela graduacao
    graduacao?:string;   
    birthdate?:string;
    situacaoInscricao?:string;
    situacao?:string;
    pesoGraduacao?:number;
    nota?:number;
    mediaFinal?:number;
    exame?:number;
    faltas?:number;
    excluido:boolean;
    motivoExcluido:string;
    desistente:boolean;
    motivoDesistente:string;
    type?:string;
    diariaDeCurso?:number;
    diariaMilitar?:number;
    diariaDeCursoQtd?:number;
    escolaridade?:string
    conceito?:string;
    }
  
  
  